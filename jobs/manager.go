package jobs

import (
	"fmt"
	"log"
	"runtime/debug"
	"time"

	"github.com/qw4n7y/gopubsub"
	"github.com/qw4n7y/highkick/models"
	"github.com/qw4n7y/highkick/repository"
)

// Internal options

type RunMode int

const (
	RunModeGoroutines RunMode = iota
	RunModeCoherently
)

type ErrorMode int

const (
	ErrorModePanic ErrorMode = iota
	ErrorModeReturn
)

// Manager is Manager
type Manager struct {
	workers    map[string]Worker
	JobsPubSub *gopubsub.Hub
}

// NewManager is a constructor
func NewManager() *Manager {
	manager := Manager{
		JobsPubSub: gopubsub.NewHub(),
	}
	return &manager
}

// RunJob runs / restarts a new job
func (m *Manager) RunJob(job *models.Job) *models.Job {
	newJob, _ := m.runJob(job, ErrorModePanic, RunModeGoroutines)
	return newJob
}

func (m *Manager) RunJobCoherently(job *models.Job) (*models.Job, error) {
	newJob, resultErr := m.runJob(job, ErrorModeReturn, RunModeCoherently)
	return newJob, resultErr
}

func (m *Manager) runJob(job *models.Job, errorMode ErrorMode, runMode RunMode) (*models.Job, error) {
	worker := m.workers[job.Type]
	if worker == nil {
		panic(fmt.Sprintf("No worker found for %v", job.Type))
	}

	job.Status = models.StatusProcessing
	job.CreatedAt = time.Now()
	if err := repository.SaveJob(job); err != nil {
		panic(err.Error())
	}

	actor := func(errorMode ErrorMode) error {
		defer func() {
			var err error

			if r := recover(); r != nil {
				err = fmt.Errorf("%v", r)
			}

			if err == nil {
				m.completeJob(job)
			} else {
				m.failJob(job, err)
			}
		}()

		m.BroadcastJobUpdate(job, nil)
		m.clearJob(job)

		executionError := worker(job)

		if errorMode == ErrorModePanic {
			if executionError != nil {
				panic(executionError.Error())
			}
		}

		return executionError
	}

	if runMode == RunModeCoherently {
		fmt.Printf("[HIGHKICK] Running job %v coherently\n", job.Type)
		resultError := actor(errorMode)
		return job, resultError
	}
	if runMode == RunModeGoroutines {
		fmt.Printf("[HIGHKICK] Running job %v in goroutine\n", job.Type)
		go func() {
			actor(errorMode)
		}()
	}

	return job, nil
}

// completeJob is called on job's completion
func (m *Manager) completeJob(job *models.Job) {
	job.Status = models.StatusCompleted
	if err := repository.SaveJob(job); err != nil {
		log.Fatal(err)
	}
	m.BroadcastJobUpdate(job, nil)
}

// completeJob is called when job has failed
func (m *Manager) failJob(job *models.Job, err error) {
	job.Status = models.StatusFailed
	if err := repository.SaveJob(job); err != nil {
		log.Fatal(err)
	}

	log.Print(fmt.Sprintf("[JOB] [%v] %v", job.Type, err.Error()))
	log.Print(fmt.Sprintf("[JOB] [%v] Stacktrace: %v", job.Type, string(debug.Stack())))
	m.Log(job, fmt.Sprintf("[ERROR] %v. Stack: %v", err.Error(), string(debug.Stack())))
	m.BroadcastJobUpdate(job, err)
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
	if err := repository.SaveJobLog(jobLog); err != nil {
		panic(err)
	}
}

// SetOutput preserves string value by key in job's dictionary
func (m *Manager) SetOutput(job *models.Job, key string, value string) {
	output := job.GetOutput()
	output[key] = value
	job.SetOutput(output)
	if err := repository.SaveJob(job); err != nil {
		panic(err.Error())
	}
}

// GetOutput gets string by key from job's dictionary
func (m *Manager) GetOutput(job *models.Job, key string) *string {
	output := job.GetOutput()
	value, exists := output[key]
	if exists == false {
		return nil
	}
	valueStr := value.(string)
	return &valueStr
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

func (m *Manager) BroadcastJobUpdate(job *models.Job, err error) {
	BroadcastJobUpdateViaWS(job)
	pubSubMessage := models.PubSubMessage{
		Job:   *job,
		Error: err,
	}
	m.JobsPubSub.Publish(pubSubMessage)
}
