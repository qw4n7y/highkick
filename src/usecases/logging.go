package usecases

import (
	"time"

	"github.com/qw4n7y/highkick/src/models"
	jobLogsRepo "github.com/qw4n7y/highkick/src/repo/job_logs"
	jobsRepo "github.com/qw4n7y/highkick/src/repo/jobs"
)

// Log message for a job
func Log(job *models.Job, message string) {
	maxContentLength := len(message)
	if maxContentLength > 65535 {
		maxContentLength = 65535
	}

	jobLog := &models.JobLog{
		JobID:     job.ID,
		JobPath:   job.Path,
		Content:   message[:maxContentLength], // Content is MySQL TEXT
		CreatedAt: time.Now(),
	}
	if err := jobLogsRepo.Repo.Save(jobLog); err != nil {
		panic(err)
	}

	job.LogsCount++
	if err := jobsRepo.Repo.Save(job); err != nil {
		panic(err)
	}
}

// SetOutput preserves string value by key in job's dictionary
func SetOutput(job *models.Job, key string, value string) {
	output := job.GetOutput()
	output[key] = value
	job.SetOutput(output)
	if err := jobsRepo.Repo.Save(job); err != nil {
		panic(err.Error())
	}
}

// GetOutput gets string by key from job's dictionary
func GetOutput(job *models.Job, key string) *string {
	output := job.GetOutput()
	value, exists := output[key]
	if exists == false {
		return nil
	}
	valueStr := value.(string)
	return &valueStr
}
