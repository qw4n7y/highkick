package repository

import (
	"fmt"
	"highkick/database"
	"highkick/models"
)

// GetJobLogs is SELECT for job logs
//
func GetJobLogs(job *models.Job) []*models.JobLog {
	dbr := database.Manager.DBR

	tail := fmt.Sprintf("WHERE job_id = %v", job.ID)
	rows, err := dbr.SelectAllFrom(models.JobLogTable, tail)
	if err != nil {
		panic(err)
	}

	jobLogs := make([]*models.JobLog, len(rows))
	for i, row := range rows {
		jobLogs[i] = row.(*models.JobLog)
	}

	return jobLogs
}

// SaveJobLog persists job log to database
func SaveJobLog(jobLog *models.JobLog) error {
	dbr := database.Manager.DBR

	err := dbr.Save(jobLog)

	return err
}
