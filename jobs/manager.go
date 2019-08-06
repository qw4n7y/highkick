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
func (m *Manager) RunJob(job *models.Job, parameters ...interface{}) *models.Job {
	worker := m.workers[job.Type]
	if worker == nil {
		panic(fmt.Sprintf("No worker found for %v", job.Type))
	}

	runCoherently := false
	if len(parameters) > 0 {
		runCoherently = parameters[0].(bool)
	}

	job.Status = models.StatusProcessing
	job.CreatedAt = time.Now()
	if err := repository.SaveJob(job); err != nil {
		panic(err.Error())
	}

	actor := func(worker Worker, job models.Job) {
		defer func() {
			var err error

			if r := recover(); r != nil {
				err = fmt.Errorf("%v", r)
			}

			if err == nil {
				m.completeJob(&job)
			} else {
				m.failJob(&job, err)
			}
		}()

		m.BroadcastJobUpdate(&job, nil)
		m.clearJob(&job)

		if err := worker(&job); err != nil {
			panic(err.Error())
		}

		return
	}
	arguments := []interface{}{worker, *job}

	if runCoherently {
		fmt.Println("[JOB] Running coherently")
		actor(arguments[0].(Worker), arguments[1].(models.Job))
	} else {
		go func(worker Worker, job models.Job) {
			actor(worker, job)
		}(arguments[0].(Worker), arguments[1].(models.Job))
	}

	return job
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
