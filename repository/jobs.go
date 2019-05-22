package repository

import (
	"fmt"
	"highkick/database"
	"highkick/models"
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
	tail := fmt.Sprintf("WHERE path LIKE \"%v/%%\" OR path LIKE \"%v/%%\" OR path LIKE \"%v\" OR id = %v", job.Path, job.ID, job.ID, job.ID)
	jobs := GetJobs(tail)
	return jobs
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
