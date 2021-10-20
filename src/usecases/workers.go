package usecases

import (
	"fmt"
	"time"

	"github.com/qw4n7y/highkick/src/models"
	workersRepo "github.com/qw4n7y/highkick/src/repo/workers"
)

func RegisterAndRunWorker(worker models.Worker, jobsToHandle models.JobsToHandle) (*models.Worker, error) {
	if err := workersRepo.Repo.Save(&worker); err != nil {
		return nil, err
	}

	RunWorker(worker, jobsToHandle)

	return &worker, nil
}

// Timer to delete stopped workers with 0 running jobs
// Running callback
//
func RunWorkerMonitor(workerID int, onDestroy func()) {
	go func() {
		every := 30 * time.Second
		for {
			worker, err := workersRepo.GetOne(workerID)
			if err != nil {
				fmt.Printf("[RunWorkerProcessStopper] %v\n", err)
			} else if worker == nil {
				fmt.Printf("[RunWorkerProcessStopper] No worker ID = %v found\n", workerID)
			} else {
				if worker.Stopped {
					if worker.RunningJobsCount == 0 {
						// STOP
						if err := workersRepo.Repo.Destroy(worker); err != nil {
							fmt.Printf("[RunWorkerProcessStopper] %v\n", err)
						}
						fmt.Printf("[RunWorkerProcessStopper] Worker %v destroyed\n", workerID)
						onDestroy()
					}
				}
			}

			time.Sleep(every)
		}
	}()
}
