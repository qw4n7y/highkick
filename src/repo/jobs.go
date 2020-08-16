package repo

import (
	"fmt"

	"github.com/qw4n7y/highkick/src/database"
	"github.com/qw4n7y/highkick/src/models"
)

// GetJobByID is GetJobByID
func GetJobByID(id int32) *models.Job {
	dbr := database.Manager.DBR

	row, err := dbr.SelectOneFrom(models.JobTable, "WHERE id = ?", id)
	if err != nil {
		panic(err)
	}

	job := row.(*models.Job)
	return job
}

// GetJobs is SELECT for jobs
func GetJobs(filters Filters, tail string) []*models.Job {
	dbr := database.Manager.DBR

	sql := fmt.Sprintf("WHERE %v %v", filters.SQLWhereClauses(), tail)
	rows, err := dbr.SelectAllFrom(models.JobTable, sql)
	if err != nil {
		panic(err)
	}

	jobs := make([]*models.Job, len(rows))
	for i, row := range rows {
		jobs[i] = row.(*models.Job)
	}

	return jobs
}

// GetJobTree returns all jobs in the tree of specified job
func GetJobTree(job *models.Job) []*models.Job {
	filters := Filters{Root: job}
	jobs := GetJobs(filters, "")
	return jobs
}

// SaveJob persists job to database
func SaveJob(job *models.Job) error {
	dbr := database.Manager.DBR
	err := dbr.Save(job)
	return err
}

// GetJobTreeStatus .
func GetJobTreeStatus(job *models.Job) string {
	jobs := GetJobTree(job)
	anyProcessing := false
	anyFailed := false
	allCompleted := true
	for _, j := range jobs {
		switch j.Status {
		case models.StatusProcessing:
			anyProcessing = true
			allCompleted = false
		case models.StatusFailed:
			anyFailed = true
			allCompleted = false
		case models.StatusInitial:
			allCompleted = false
		}
	}
	switch {
	case anyProcessing:
		return models.StatusProcessing
	case anyFailed:
		return models.StatusFailed
	case allCompleted:
		return models.StatusCompleted
	default:
		return models.StatusInitial
	}
}

func GetJobAndItsTreeStatus(job models.Job) string {
	treeStatus := GetJobTreeStatus(&job)

	if job.Status == models.StatusProcessing || treeStatus == models.StatusProcessing {
		return models.StatusProcessing
	}

	if job.Status == models.StatusFailed || treeStatus == models.StatusFailed {
		return models.StatusFailed
	}

	return job.Status
}

// GetSiblingsDetailedStatus .
func GetSiblingsDetailedStatus(job *models.Job) map[string]int {
	result := map[string]int{}

	filters := Filters{SiblingsOf: job}
	siblings := GetJobs(filters, "")

	for _, sibling := range siblings {
		status := GetJobAndItsTreeStatus(*sibling)
		if _, exists := result[status]; exists == false {
			result[status] = 0
		}
		result[status] += 1
	}

	return result
}

// GetRootJob gets the root job
func GetRootJob(job *models.Job) *models.Job {
	dbr := database.Manager.DBR

	if job.IsRoot() {
		return job
	}

	rootID, _ := job.GetRootID()
	rootJob := &models.Job{}
	tail := fmt.Sprintf("WHERE id = %v", dbr.Placeholder(1))
	if err := dbr.SelectOneTo(rootJob, tail, rootID); err != nil {
		panic(err)
	}
	return rootJob
}

// GetRootJobs is GetRootJobs
func GetRootJobs(filters Filters, page int, limit int) []*models.Job {
	offset := (page - 1) * limit
	isRoot := true
	filters.IsRoot = &isRoot
	tail := fmt.Sprintf("ORDER BY id DESC LIMIT %v OFFSET %v", limit, offset)
	roots := GetJobs(filters, tail)
	return roots
}

// DestroyJob destroys job from database
func DestroyJob(job *models.Job) error {
	dbr := database.Manager.DBR
	err := dbr.Delete(job)
	return err
}
