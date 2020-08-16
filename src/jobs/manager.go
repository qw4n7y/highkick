package jobs

import (
	"fmt"
	"log"
	"runtime/debug"
	"sync"
	"time"

	"github.com/qw4n7y/gopubsub"
	"github.com/qw4n7y/highkick/src/models"
	"github.com/qw4n7y/highkick/src/repo"
	"github.com/robfig/cron"
)

// Internal options

type RunChildJobMode int

const (
	RunChildJobModeSeparately RunChildJobMode = iota // run child jobs in new goroutines
	RunChildJobModeCoherently                        // run child jobs in same goroutine. waits them to execute
)

type ErrorMode int

const (
	ErrorModePanic ErrorMode = iota
	ErrorModeReturn
)

type ExecutionMode int

const (
	ExecutionModeRegular         ExecutionMode = iota // any number of workers
	ExecutionModeOneWorkerAtOnce                      // one worker at once
)

// Manager is Manager
type Manager struct {
	workers        map[string]Worker
	JobsPubSub     *gopubsub.Hub
	cron           *cron.Cron
	locks          map[string]*sync.Mutex
	rwLockForLocks sync.RWMutex
}

// NewManager is a constructor
func NewManager() *Manager {
	manager := Manager{
		JobsPubSub: gopubsub.NewHub(),
		cron:       cron.New(),
		locks:      map[string]*sync.Mutex{},
	}
	manager.cron.Start()
	return &manager
}

// RunJob runs the job. Separately
func (m *Manager) RunJob(job *models.Job) *models.Job {
	newJob, _ := m.runJob(job, ErrorModePanic, RunChildJobModeSeparately, ExecutionModeRegular)
	return newJob
}

// RunJobCoherently runs the job. Coherently
func (m *Manager) RunJobCoherently(job *models.Job) (*models.Job, error) {
	newJob, resultErr := m.runJob(job, ErrorModeReturn, RunChildJobModeCoherently, ExecutionModeRegular)
	return newJob, resultErr
}

// RunWithOneWorkerAtOnce runs the job. With one worker at once.
func (m *Manager) RunWithOneWorkerAtOnce(job *models.Job) *models.Job {
	newJob, _ := m.runJob(job, ErrorModePanic, RunChildJobModeSeparately, ExecutionModeOneWorkerAtOnce)
	return newJob
}

// RunWithOneWorkerAtOnceCoherently runs the job coherently. With one worker at once.
func (m *Manager) RunWithOneWorkerAtOnceCoherently(job *models.Job) *models.Job {
	newJob, _ := m.runJob(job, ErrorModePanic, RunChildJobModeCoherently, ExecutionModeOneWorkerAtOnce)
	return newJob
}

func (m *Manager) runJob(job *models.Job, errorMode ErrorMode, runChildJobMode RunChildJobMode, executionMode ExecutionMode) (*models.Job, error) {
	worker := m.workers[job.Type]
	if worker == nil {
		panic(fmt.Sprintf("No worker found for %v", job.Type))
	}

	// Workaround for periodical jobs:
	// We need to keep single instance of same TYPE / INPUT / SCHEDULE not to pollute DB
	if job.Cron != nil {
		existingJobs := repo.GetJobs(repo.Filters{
			Cron: job.Cron,
			Type: &job.Type,
		}, "ORDER BY id DESC LIMIT 1")
		if len(existingJobs) == 1 {
			job = existingJobs[0]
		}
	}

	job.Status = models.StatusProcessing
	job.CreatedAt = time.Now()
	if err := repo.SaveJob(job); err != nil {
		panic(err.Error())
	}

	execute := func(errorMode ErrorMode) error {
		if executionMode == ExecutionModeOneWorkerAtOnce {
			m.rwLockForLocks.RLock()
			_, exists := m.locks[job.Identificator()]
			m.rwLockForLocks.RUnlock()

			if exists == false {
				m.rwLockForLocks.Lock()
				m.locks[job.Identificator()] = &sync.Mutex{}
				m.rwLockForLocks.Unlock()
			}

			m.rwLockForLocks.RLock()
			lock, _ := m.locks[job.Identificator()]
			lock.Lock()
			m.rwLockForLocks.RUnlock()
		}

		defer func() {
			if executionMode == ExecutionModeOneWorkerAtOnce {
				m.rwLockForLocks.RLock()
				lock, _ := m.locks[job.Identificator()]
				lock.Unlock()
				m.rwLockForLocks.RUnlock()
			}

			if r := recover(); r == nil {
				m.completeJob(job)
			} else {
				m.failJob(job, fmt.Errorf("%v", r))
			}
		}()

		m.BroadcastJobUpdate(job, nil)
		m.clearJob(job)

		executionError := worker(job)
		if executionError != nil {
			if errorMode == ErrorModePanic {
				panic(executionError.Error())
			}
			if errorMode == ErrorModeReturn {
				m.failJob(job, executionError)
			}
		}

		return executionError
	}

	if job.Cron != nil { // PERIODICAL
		fmt.Printf("[HIGHKICK] Starting periodical job %v\n", job.Type)
		err := m.cron.AddFunc(*job.Cron, func() {
			_ = execute(ErrorModeReturn)
		})
		return job, err
	} else if runChildJobMode == RunChildJobModeCoherently { // COHERENT
		fmt.Printf("[HIGHKICK] Running job %v coherently\n", job.Type)
		resultError := execute(errorMode)
		return job, resultError
	} else if runChildJobMode == RunChildJobModeSeparately { // PARALLEL
		fmt.Printf("[HIGHKICK] Running job %v in goroutine\n", job.Type)
		go func() {
			execute(errorMode)
		}()
	}

	return job, nil
}

// completeJob is called on job's completion
func (m *Manager) completeJob(job *models.Job) {
	job.Status = models.StatusCompleted
	if err := repo.SaveJob(job); err != nil {
		log.Fatal(err)
	}
	m.BroadcastJobUpdate(job, nil)
}

// completeJob is called when job has failed
func (m *Manager) failJob(job *models.Job, err error) {
	job.Status = models.StatusFailed
	if err := repo.SaveJob(job); err != nil {
		log.Fatal(err)
	}

	log.Print(fmt.Sprintf("[JOB] [%v] %v", job.Type, err.Error()))
	log.Print(fmt.Sprintf("[JOB] [%v] Stacktrace: %v", job.Type, string(debug.Stack())))
	m.Log(job, fmt.Sprintf("[ERROR] %v. Stack: %v", err.Error(), string(debug.Stack())))
	m.BroadcastJobUpdate(job, err)
}

func (m *Manager) clearJob(job *models.Job) {
	jobs := repo.GetJobTree(job)
	for _, j := range jobs {
		if err := repo.DestroyJobLogsFor(j); err != nil {
			panic(err.Error())
		}
		if j.ID == job.ID {
			continue
		}
		if err := repo.DestroyJob(j); err != nil {
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
	if err := repo.SaveJobLog(jobLog); err != nil {
		panic(err)
	}
}

// SetOutput preserves string value by key in job's dictionary
func (m *Manager) SetOutput(job *models.Job, key string, value string) {
	output := job.GetOutput()
	output[key] = value
	job.SetOutput(output)
	if err := repo.SaveJob(job); err != nil {
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
