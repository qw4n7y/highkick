package jobs

import (
	"errors"
	"fmt"
	"highkick/models"
	"highkick/repository"
	"log"
	"time"
)

// Manager is Manager
type Manager struct {
	workers map[string]Worker
}

// RunJob runs / restarts a new job
func (m *Manager) RunJob(job *models.Job) {
	go func() (err error) {
		defer func() {
			if r := recover(); r != nil {
				err = errors.New(fmt.Sprintf("%v", r))
			}

			if err == nil {
				m.completeJob(job)
			} else {
				m.failJob(job, err)
			}
		}()

		worker := m.workers[job.Type]
		if worker == nil {
			panic(fmt.Sprintf("No worker found for %v", job.Type))
		}

		job.Status = models.StatusProcessing
		err = repository.SaveJob(job)
		if err != nil {
			panic(err)
		}

		err = worker(m, job)
		return
	}()
}

// checkIfTreeIsDone checks if all jobs are done and completes
// the root
func (m *Manager) checkIfTreeIsDoneAndCompleteRootJob(job *models.Job) {
	jobs := repository.GetJobTree(job)

	anyFailed := false
	allAreDone := true
	for _, job := range jobs {
		if job.IsRoot() {
			continue
		}

		if job.IsFailed() {
			anyFailed = true
		}

		if !job.IsFailed() && !job.IsCompleted() {
			allAreDone = false
		}
	}

	if !allAreDone {
		return
	}

	rootJob := repository.GetRootJob(job)
	if anyFailed {
		rootJob.Status = models.StatusFailed
	} else {
		rootJob.Status = models.StatusCompleted
	}
	if err := repository.SaveJob(rootJob); err != nil {
		panic(err)
	}
}

// completeJob is called on job's completion
func (m *Manager) completeJob(job *models.Job) {
	job.Status = models.StatusCompleted
	if err := repository.SaveJob(job); err != nil {
		log.Fatal(err)
	}

	m.checkIfTreeIsDoneAndCompleteRootJob(job)
}

// completeJob is called when job has failed
func (m *Manager) failJob(job *models.Job, err error) {
	job.Status = models.StatusFailed
	if err := repository.SaveJob(job); err != nil {
		log.Fatal(err)
	}

	log.Print(fmt.Sprintf("[JOB] [%v] %v", job.Type, err.Error()))
	m.Log(job, fmt.Sprintf("[ERROR] %v", err.Error()))
}

// Log message for a job
func (m *Manager) Log(job *models.Job, message string) {
	jobLog := &models.JobLog{
		JobID:     job.ID,
		JobPath:   job.Path,
		Content:   message,
		CreatedAt: time.Now(),
	}
	if err := repository.SaveJobLog(jobLog); err != nil {
		panic(err)
	}
}

// RegisterWorker registers worker for specified jobType
func (m *Manager) RegisterWorker(jobType string, worker Worker) {
	if m.workers == nil {
		m.workers = make(map[string]Worker)
	}
	m.workers[jobType] = worker
}
