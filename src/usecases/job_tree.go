package usecases

import (
	"github.com/qw4n7y/highkick/src/models"
	repo "github.com/qw4n7y/highkick/src/repo/jobs"
)

// GetJobTreeStatus .
func GetJobTreeStatus(job models.Job) (*models.JobStatus, error) {
	jobs, err := repo.Repo.Get(repo.QueryBuilder{
		Root: &job,
	})
	if err != nil {
		return nil, err
	}

	anyProcessing := false
	anyFailed := false
	allCompleted := true
	for _, j := range *jobs {
		switch j.Status {
		case models.JobStatuses.Processing:
			anyProcessing = true
			allCompleted = false
		case models.JobStatuses.Failed:
			anyFailed = true
			allCompleted = false
		case models.JobStatuses.Initial:
			allCompleted = false
		}
	}
	switch {
	case anyProcessing:
		return &models.JobStatuses.Processing, nil
	case anyFailed:
		return &models.JobStatuses.Failed, nil
	case allCompleted:
		return &models.JobStatuses.Completed, nil
	default:
		return &models.JobStatuses.Initial, nil
	}
}

func GetJobAndItsTreeStatus(job models.Job) (*models.JobStatus, error) {
	treeStatus, err := GetJobTreeStatus(job)
	if err != nil {
		return nil, err
	}

	if job.Status == models.JobStatuses.Processing || *treeStatus == models.JobStatuses.Processing {
		return &models.JobStatuses.Processing, nil
	}

	if job.Status == models.JobStatuses.Failed || *treeStatus == models.JobStatuses.Failed {
		return &models.JobStatuses.Failed, nil
	}

	return &job.Status, nil
}

// GetSiblingsDetailedStatus .
func GetSiblingsDetailedStatus(job *models.Job) (*map[models.JobStatus]int, error) {
	result := map[models.JobStatus]int{}

	siblings, err := repo.Repo.Get(repo.QueryBuilder{
		SiblingsOf: job,
	})
	if err != nil {
		panic(err)
	}

	for _, sibling := range *siblings {
		status, err := GetJobAndItsTreeStatus(sibling)
		if err != nil {
			return nil, err
		}
		if _, exists := result[*status]; exists == false {
			result[*status] = 0
		}
		result[*status] += 1
	}

	return &result, nil
}

type ChildrenStat struct {
	RootID           int
	ChildrenStatuses map[models.JobStatus]int
}

func GetChildrenStat(job *models.Job) (*ChildrenStat, error) {
	result := ChildrenStat{
		RootID:           job.ID,
		ChildrenStatuses: map[models.JobStatus]int{},
	}

	children, err := repo.Repo.Get(repo.QueryBuilder{
		Root: job,
	})
	if err != nil {
		return nil, err
	}

	for _, child := range *children {
		result.ChildrenStatuses[child.Status] += 1
	}

	return &result, nil
}
