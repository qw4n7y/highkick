package jobs

import (
	"fmt"
	"log"
	"runtime/debug"
	"time"

	"github.com/qw4n7y/highkick/models"
	"github.com/qw4n7y/highkick/repository"
)

// Manager is Manager
type Manager struct {
	workers map[string]Worker
}

// RunJob runs / restarts a new job
func (m *Manager) RunJob(job *models.Job) *models.Job {
	worker := m.workers[job.Type]
	if worker == nil {
		panic(fmt.Sprintf("No worker found for %v", job.Type))
	}

	job.Status = models.StatusProcessing
	job.CreatedAt = time.Now()
	if err := repository.SaveJob(job); err != nil {
		panic(err.Error())
	}

	// NOTE: meditate about: share pointers or pass a copies
	go func(worker Worker, job models.Job) {
		defer func() {
			var err error

			if r := recover(); r != nil {
				// errors.New(fmt.Sprintf("Recovered panic: %v", r))
				err = fmt.Errorf("Recovered panic: %v (from job#%v)", r, job.ID)
			}

			if err == nil {
				m.completeJob(&job)
			} else {
				m.failJob(&job, err)
			}
		}()

		m.clearJob(&job)

		if err := worker(&job); err != nil {
			panic(err.Error())
		}

		return
	}(worker, *job)

	return job
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

	m.checkIfTreeIsDoneAndCompleteRootJob(job)

	log.Print(fmt.Sprintf("[JOB] [%v] %v", job.Type, err.Error()))
	m.Log(job, fmt.Sprintf("[ERROR] %v. Stack: %v", err.Error(), string(debug.Stack())))
}

func (m *Manager) clearJob(job *models.Job) {
	jobs := repository.GetJobTree(job)
	for _, j := range jobs {
		if err := repository.DestroyJobLogsFor(j); err != nil {
			panic(err.Error())
		}
		if j.ID == job.ID {
			continue
		}
		if err := repository.DestroyJob(j); err != nil {
			panic(err.Error())
		}
	}
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

// UnregisterAllWorkers unregisters all workers
func (m *Manager) UnregisterAllWorkers() {
	m.workers = make(map[string]Worker)
}
