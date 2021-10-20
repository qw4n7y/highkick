package usecases

import (
	"fmt"
	"log"
	"runtime/debug"
	"time"

	"github.com/qw4n7y/highkick/src/models"
	jobLogsRepo "github.com/qw4n7y/highkick/src/repo/job_logs"
	jobsRepo "github.com/qw4n7y/highkick/src/repo/jobs"
	workersRepo "github.com/qw4n7y/highkick/src/repo/workers"
)

func RunWorker(worker models.Worker, jobsToHandle models.JobsToHandle) {
	fmt.Printf("[HIGHKICK] Worker %v %v %v started\n", worker.ID, worker.SID, worker.ProcessSID)
	go func() {
		every := 30 * time.Second
		for {
			worker, err := workersRepo.GetOne(worker.ID)
			if err != nil {
				fmt.Println("[RunWorkerLauncher/ERROR]", err)
			}
			if worker == nil {
				fmt.Printf("[RunWorkerLauncher] No worker %v found\n", worker.ID)
			}
			if worker.Stopped {
				break
			}

			scheduledJobs, err := jobsRepo.Repo.Get(jobsRepo.QueryBuilder{
				Status:      &models.JobStatuses.Scheduled,
				JobTypes:    &jobsToHandle.Only,
				JobTypesNot: &jobsToHandle.Except,
			})
			if err != nil {
				fmt.Println("[RunWorkerLauncher/ERROR]", err)
			}
			for _, scheduledJob := range *scheduledJobs {
				job := scheduledJob // need to copy
				go func() {
					job.WorkerID = worker.ID
					err := RunSync(job)
					if err != nil {
						fmt.Printf("[HIGHKICK] Job failed %v: %+v\n", job.Type, err)
					}
				}()
			}
			time.Sleep(every)
		}
		fmt.Printf("[HIGHKICK] Worker %v %v %v stopped\n", worker.ID, worker.SID, worker.ProcessSID)
	}()
}

func RunAsync(job *models.Job) error {
	job.Status = models.JobStatuses.Scheduled
	job.CreatedAt = time.Now()
	if err := jobsRepo.Repo.Save(job); err != nil {
		return err
	}
	return nil
}

func RunSync(job models.Job) error {
	workersRepo.IncrementRunningJobsCount(job.WorkerID, 1)
	defer workersRepo.IncrementRunningJobsCount(job.WorkerID, -1)

	job.Status = models.JobStatuses.Initial
	job.CreatedAt = time.Now()
	if err := jobsRepo.Repo.Save(&job); err != nil {
		return err
	}
	_, err := runJob(&job)
	return err
}

func runJob(job *models.Job) (*models.Job, error) {
	var jobMeta *models.JobMeta
	if w, exists := jobMetas[job.Type]; exists == true {
		jobMeta = &w
	} else {
		return nil, fmt.Errorf("No worker found for %v", job.Type)
	}

	job.Status = models.JobStatuses.Processing
	now := time.Now()
	job.StartedAt = &now
	if err := jobsRepo.Repo.Save(job); err != nil {
		return nil, err
	}

	execute := func() (resultErr error) {
		defer func() {
			if rec := recover(); rec != nil {
				err := fmt.Errorf("%+v", rec)
				failJob(job, err)
				resultErr = err
			}
		}()

		BroadcastJobUpdate(job, nil)
		clearJob(job)

		err := jobMeta.Perform(job)

		if err == nil {
			completeJob(job)
		} else {
			failJob(job, err)
		}

		return err
	}

	fmt.Printf("[HIGHKICK] Running job %v\n", job.Type)
	err := execute()
	return job, err
}

// completeJob is called on job's completion
func completeJob(job *models.Job) {
	job.Status = models.JobStatuses.Completed
	now := time.Now()
	job.FinishedAt = &now
	if err := jobsRepo.Repo.Save(job); err != nil {
		log.Fatal(err)
	}
	BroadcastJobUpdate(job, nil)
}

// completeJob is called when job has failed
func failJob(job *models.Job, err error) {
	job.Status = models.JobStatuses.Failed
	now := time.Now()
	job.FinishedAt = &now
	if err := jobsRepo.Repo.Save(job); err != nil {
		log.Fatal(err)
	}

	// Set root job status to failed
	if job.IsRoot() == false {
		rootID := job.GetRootID()
		if err := jobsRepo.Repo.UpdateAll(&models.Job{
			Status: models.JobStatuses.Failed,
		}, []string{"status"}, jobsRepo.QueryBuilder{
			ID: &rootID,
		}); err != nil {
			log.Fatal(err)
		}
	}

	log.Print(fmt.Sprintf("[JOB] [%v] %v", job.Type, err.Error()))
	log.Print(fmt.Sprintf("[JOB] [%v] Stacktrace: %v", job.Type, string(debug.Stack())))
	Log(job, fmt.Sprintf("[ERROR] %v. Stack: %v", err.Error(), string(debug.Stack())))
	BroadcastJobUpdate(job, err)
}

func clearJob(job *models.Job) {
	jobs, err := jobsRepo.Repo.Get(jobsRepo.QueryBuilder{
		Root: job,
	})
	if err != nil {
		panic(err.Error())
	}

	for _, j := range *jobs {
		if err := jobLogsRepo.Repo.DestroyAll(jobLogsRepo.QueryBuilder{
			JobID: &j.ID,
		}); err != nil {
			panic(err.Error())
		}
		if j.ID == job.ID {
			continue
		}
		if err := jobsRepo.Repo.Destroy(&j); err != nil {
			panic(err.Error())
		}
	}
}
