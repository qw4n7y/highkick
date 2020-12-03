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

var jobs map[string]Job
var JobsPubSub *gopubsub.Hub
var cronManager *cron.Cron
var locks map[string]*sync.Mutex
var rwLockForLocks sync.RWMutex

func init() {
	JobsPubSub = gopubsub.NewHub()
	cronManager = cron.New()
	locks = map[string]*sync.Mutex{}
	cronManager.Start()
}

// RunJob runs the job. Separately
func RunJob(job *models.Job) *models.Job {
	newJob, _ := runJob(job, ErrorModePanic, RunChildJobModeSeparately, ExecutionModeRegular)
	return newJob
}

// RunJobCoherently runs the job. Coherently
func RunJobCoherently(job *models.Job) (*models.Job, error) {
	newJob, resultErr := runJob(job, ErrorModeReturn, RunChildJobModeCoherently, ExecutionModeRegular)
	return newJob, resultErr
}

// RunWithOneWorkerAtOnce runs the job. With one worker at once.
func RunWithOneWorkerAtOnce(job *models.Job) *models.Job {
	newJob, _ := runJob(job, ErrorModePanic, RunChildJobModeSeparately, ExecutionModeOneWorkerAtOnce)
	return newJob
}

// RunWithOneWorkerAtOnceCoherently runs the job coherently. With one worker at once.
func RunWithOneWorkerAtOnceCoherently(job *models.Job) *models.Job {
	newJob, _ := runJob(job, ErrorModePanic, RunChildJobModeCoherently, ExecutionModeOneWorkerAtOnce)
	return newJob
}

func runJob(job *models.Job, errorMode ErrorMode, runChildJobMode RunChildJobMode, executionMode ExecutionMode) (*models.Job, error) {
	// CRON case
	if job.Cron != nil {
		existingJobs := repo.GetJobs(repo.Filters{
			Cron: job.Cron,
			Type: &job.Type,
		}, "ORDER BY id DESC LIMIT 1")
		if len(existingJobs) == 1 {
			job = existingJobs[0]
		}

		fmt.Printf("[HIGHKICK] Starting periodical job %v\n", job.Type)
		err := cronManager.AddFunc(*job.Cron, func() {
			childJob := models.BuildJob(job.Type, job.GetInput(), job)
			_, err := executeJob(childJob, errorMode, runChildJobMode, executionMode)
			if err != nil {
				fmt.Printf("[HIGHKICK] [Periodiabl job %+v] [Error] %+v", job.Type, err)
			}
		})
		return job, err
	}

	return executeJob(job, errorMode, runChildJobMode, executionMode)
}

func executeJob(job *models.Job, errorMode ErrorMode, runChildJobMode RunChildJobMode, executionMode ExecutionMode) (*models.Job, error) {
	var jobMeta *Job
	if w, exists := jobs[job.Type]; exists == true {
		jobMeta = &w
	} else {
		panic(fmt.Sprintf("No worker found for %v", job.Type))
	}

	job.Status = models.StatusProcessing
	job.CreatedAt = time.Now()
	if err := repo.SaveJob(job); err != nil {
		panic(err.Error())
	}

	execute := func(errorMode ErrorMode) error {
		if executionMode == ExecutionModeOneWorkerAtOnce {
			rwLockForLocks.RLock()
			_, exists := locks[job.Identificator()]
			rwLockForLocks.RUnlock()

			if exists == false {
				rwLockForLocks.Lock()
				locks[job.Identificator()] = &sync.Mutex{}
				rwLockForLocks.Unlock()
			}

			rwLockForLocks.RLock()
			lock, _ := locks[job.Identificator()]
			lock.Lock()
			rwLockForLocks.RUnlock()
		}

		defer func() {
			if executionMode == ExecutionModeOneWorkerAtOnce {
				rwLockForLocks.RLock()
				lock, _ := locks[job.Identificator()]
				lock.Unlock()
				rwLockForLocks.RUnlock()
			}

			if r := recover(); r == nil {
				completeJob(job)
			} else {
				failJob(job, fmt.Errorf("%v", r))
			}
		}()

		BroadcastJobUpdate(job, nil)
		clearJob(job)

		executionError := jobMeta.Perform(job)
		if executionError != nil {
			if errorMode == ErrorModePanic {
				panic(executionError.Error())
			}
			if errorMode == ErrorModeReturn {
				failJob(job, executionError)
			}
		}

		return executionError
	}

	if runChildJobMode == RunChildJobModeCoherently { // COHERENT
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
func completeJob(job *models.Job) {
	job.Status = models.StatusCompleted
	if err := repo.SaveJob(job); err != nil {
		log.Fatal(err)
	}
	BroadcastJobUpdate(job, nil)
}

// completeJob is called when job has failed
func failJob(job *models.Job, err error) {
	job.Status = models.StatusFailed
	if err := repo.SaveJob(job); err != nil {
		log.Fatal(err)
	}

	log.Print(fmt.Sprintf("[JOB] [%v] %v", job.Type, err.Error()))
	log.Print(fmt.Sprintf("[JOB] [%v] Stacktrace: %v", job.Type, string(debug.Stack())))
	Log(job, fmt.Sprintf("[ERROR] %v. Stack: %v", err.Error(), string(debug.Stack())))
	BroadcastJobUpdate(job, err)
}

func clearJob(job *models.Job) {
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

func BroadcastJobUpdate(job *models.Job, err error) {
	BroadcastJobUpdateViaWS(job)
	pubSubMessage := models.PubSubMessage{
		Job:   *job,
		Error: err,
	}
	JobsPubSub.Publish(pubSubMessage)
}
