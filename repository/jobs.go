package repository

import (
	"fmt"

	"github.com/qw4n7y/highkick/database"
	"github.com/qw4n7y/highkick/models"
)

type Filters struct {
	Periodical *bool
}

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
func GetJobs(tail string) []*models.Job {
	dbr := database.Manager.DBR

	rows, err := dbr.SelectAllFrom(models.JobTable, tail)
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
	tail := fmt.Sprintf(
		`WHERE path LIKE "%v/%v/%%" OR path LIKE "%v/%%" OR path = "%v" OR id = %v`,
		job.Path, job.ID, job.ID, job.ID, job.ID)
	jobs := GetJobs(tail)
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
	tail := "WHERE path = ''"
	if filters.Periodical != nil {
		if *filters.Periodical == true {
			tail = fmt.Sprintf("%v AND cron IS NOT NULL", tail)
		} else {
			tail = fmt.Sprintf("%v AND cron IS NULL", tail)
		}
	}
	tail = fmt.Sprintf("%v ORDER BY id DESC LIMIT %v OFFSET %v", tail, limit, offset)
	roots := GetJobs(tail)
	return roots
}

// DestroyJob destroys job from database
func DestroyJob(job *models.Job) error {
	dbr := database.Manager.DBR
	err := dbr.Delete(job)
	return err
}
