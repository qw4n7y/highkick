package usecases

import (
	"fmt"
	"log"
	"runtime/debug"
	"time"

	"github.com/qw4n7y/highkick/src/models"
	"github.com/qw4n7y/highkick/src/repo"
)

func RunWorkerLauncher() {
	fmt.Printf("[HIGHKICK] Workers launcher started\n")
	go func(){
		every := 30 * time.Second
		for {
			jobs := repo.GetJobs(repo.Filters{
				Status: &models.JobStatuses.Scheduled,
			}, "")
			for _, job := range jobs {
				go func(){
					err := RunSync(job)
					if err != nil {
						fmt.Printf("[HIGHKICK] Job failed %v: %+v\n", job.Type, err)
					}
				}()
			}
			time.Sleep(every)
		}
		fmt.Printf("[HIGHKICK] Workers launcher stopped\n")
	}()
}

func RunAsync(job *models.Job) error {
	job.Status = models.JobStatuses.Scheduled
	job.CreatedAt = time.Now()
	if err := repo.SaveJob(job); err != nil {
		return err
	}
	return nil
}

func RunSync(job *models.Job) error {
	job.Status = models.JobStatuses.Initial
	job.CreatedAt = time.Now()
	if err := repo.SaveJob(job); err != nil {
		return err
	}
	_, err := runJob(job)
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
	if err := repo.SaveJob(job); err != nil {
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
	if err := repo.SaveJob(job); err != nil {
		log.Fatal(err)
	}
	BroadcastJobUpdate(job, nil)
}

// completeJob is called when job has failed
func failJob(job *models.Job, err error) {
	job.Status = models.JobStatuses.Failed
	now := time.Now()
	job.FinishedAt = &now
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
