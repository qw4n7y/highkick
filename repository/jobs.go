package repository

import (
	"fmt"
	"sidekiq/database"
	"sidekiq/models"
)

// GetJobs is SELECT for jobs
//
func GetJobs(tail string) []*models.Job {
	database := database.Database

	rows, err := database.DBR.SelectAllFrom(models.JobTable, tail)
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
	rootID, hasRoot := job.GetRootID()
	if !hasRoot {
		return []*models.Job{job}
	}

	tail := fmt.Sprintf("WHERE path LIKE \"%v.%%\" OR id = %v", rootID, rootID)
	jobs := GetJobs(tail)
	return jobs
}
