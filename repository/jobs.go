package repository

import (
	"fmt"
	"highkick/database"
	"highkick/models"
)

// GetJobs is SELECT for jobs
//
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

// GetJobTreeByRootID is GetJobTreeByRootID
func GetJobTreeByRootID(rootID int32) []*models.Job {
	tail := fmt.Sprintf("WHERE path LIKE \"%v.%%\" OR path = \"%v\" OR id = %v", rootID, rootID, rootID)
	jobs := GetJobs(tail)
	return jobs
}

// GetJobTree returns all jobs in the tree of specified job
func GetJobTree(job *models.Job) []*models.Job {
	rootID, hasRoot := job.GetRootID()
	if !hasRoot {
		return []*models.Job{job}
	}

	return GetJobTreeByRootID(rootID)
}

// SaveJob persists job to database
func SaveJob(job *models.Job) error {
	dbr := database.Manager.DBR

	err := dbr.Save(job)

	return err
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
func GetRootJobs() []*models.Job {
	roots := GetJobs("WHERE path = ''")
	return roots
}
