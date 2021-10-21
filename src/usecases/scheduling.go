package usecases

import (
	"fmt"
	"sync"
	"time"

	"github.com/qw4n7y/highkick/src/models"
	jobsRepo "github.com/qw4n7y/highkick/src/repo/jobs"
	schedulersRepo "github.com/qw4n7y/highkick/src/repo/schedulers"
	workersRepo "github.com/qw4n7y/highkick/src/repo/workers"
)

type SchedulerMeta struct {
	StopChan  chan bool
	LastRun   *models.Job
	Scheduler models.Scheduler
}

type SchedulerMetas struct {
	data map[int]SchedulerMeta
	mu   sync.RWMutex
}

func (sm SchedulerMetas) Get(schedulerID int) *SchedulerMeta {
	sm.mu.RLock()
	defer sm.mu.RUnlock()

	v, ok := sm.data[schedulerID]
	if !ok {
		return nil
	}
	return &v
}

func (sm SchedulerMetas) Set(schedulerID int, schedulerMeta SchedulerMeta) {
	sm.mu.Lock()
	defer sm.mu.Unlock()

	sm.data[schedulerID] = schedulerMeta
}

func (sm SchedulerMetas) Delete(schedulerID int) {
	sm.mu.Lock()
	defer sm.mu.Unlock()

	delete(sm.data, schedulerID)
}

func (sm SchedulerMetas) Snapshot() map[int]SchedulerMeta {
	sm.mu.RLock()
	defer sm.mu.RUnlock()

	clone := sm.data
	return clone
}

var schedulerMetas = SchedulerMetas{
	data: map[int]SchedulerMeta{},
}

func RunSchedulers(worker models.Worker, jobsToHandle models.JobsToHandle) {
	fmt.Printf("[HIGHKICK] Worker %v: schedulers started\n", worker.ID)
	go func() {
		every := 30 * time.Second
		for {
			worker, err := workersRepo.GetOne(worker.ID)
			if err != nil {
				fmt.Println("[RunSchedulers/ERROR]", err)
			}
			if worker == nil {
				fmt.Printf("[RunSchedulers] No worker %v found\n", worker.ID)
				break
			}
			if worker.Stopped {
				break
			}

			prevSchedulerIDs := []int{}
			for schedulerID := range schedulerMetas.Snapshot() {
				prevSchedulerIDs = append(prevSchedulerIDs, schedulerID)
			}

			schedulers, err := schedulersRepo.Repo.Get(schedulersRepo.QueryBuilder{
				JobTypes:    &jobsToHandle.Only,
				JobTypesNot: &jobsToHandle.Except,
			})
			if err != nil {
				fmt.Printf("[HIGHKICK] Loading schedulers: %+v\n", err)
				return
			}

			currentSchedulerIDs := map[int]bool{}
			for _, scheduler := range *schedulers {
				scheduler.WorkerID = worker.ID // will be passed thru into runScheduler

				currentSchedulerIDs[scheduler.ID] = true
				if scheduler.Stopped {
					stopScheduler(scheduler.ID)
					continue
				}
				schedulerMeta := schedulerMetas.Get(scheduler.ID)
				if schedulerMeta != nil {
					// model was changed
					if schedulerMeta.Scheduler.Equal(scheduler) == false {
						stopScheduler(scheduler.ID)
						runScheduler(scheduler)
					}
				} else {
					runScheduler(scheduler)
				}
			}

			for _, prevSchedulerID := range prevSchedulerIDs {
				// model was removed
				if _, exists := currentSchedulerIDs[prevSchedulerID]; exists == false {
					stopScheduler(prevSchedulerID)
				}
			}

			time.Sleep(every)
		}

		fmt.Printf("[HIGHKICK] Worker %v: schedulers stopped\n", worker.ID)
	}()
}

func stopScheduler(schedulerID int) {
	fmt.Printf("[Highkick] [Schedulers] Stopping %v\n", schedulerID)

	schedulerMeta := schedulerMetas.Get(schedulerID)
	if schedulerMeta != nil {
		schedulerMeta.StopChan <- true
		close(schedulerMeta.StopChan)
	}
	schedulerMetas.Delete(schedulerID)
}

func ExecuteScheduler(scheduler models.Scheduler) error {
	job := models.NewJob(scheduler.JobType, scheduler.GetJobInput(), nil)
	job.WorkerID = scheduler.WorkerID
	job.CreatedAt = time.Now() // dirty

	// Update schedule meta
	{
		if schedulerMeta := schedulerMetas.Get(scheduler.ID); schedulerMeta != nil {
			schedulerMeta.LastRun = &job
			schedulerMetas.Set(scheduler.ID, *schedulerMeta)
		} else {
			fmt.Printf("[Highkick] [Schedulers] Can not update scheduler meta for %+v\n", scheduler)
		}
	}

	// Execute
	var executionErr error
	{
		switch scheduler.SchedulerType {
		case models.SchedulerTypes.Timer:
			{
				_, executionErr = RunSync(job)
			}
		case models.SchedulerTypes.ExactTime:
			{
				_, executionErr = RunAsync(job)
			}
		}
	}

	// Store all the details to database
	now := time.Now()
	scheduler.LastRunAt = &now
	if executionErr != nil {
		scheduler.LastError = fmt.Sprintf("%+v", executionErr)
	} else {
		scheduler.LastError = ""
	}
	if err := schedulersRepo.Repo.DB.UpdateColumns(&scheduler, "last_run_at", "last_error"); err != nil {
		fmt.Printf("[Highkick] [Schedulers] Run failed with %v\n", err)
		return err
	}

	return executionErr
}

func runScheduler(scheduler models.Scheduler) {
	fmt.Printf("[Highkick] [Schedulers] Running %v\n", scheduler)

	stopChan := make(chan bool)

	lastRun := models.Job{}
	{
		// Get last 10 of roots and choose with same input. Clumzy
		truly := true
		page := 1
		limit := 10
		if candidates, err := jobsRepo.Repo.Get(jobsRepo.QueryBuilder{
			Type:      &scheduler.JobType,
			IsRoot:    &truly,
			OrderDesc: &truly,
			Page:      &page,
			PerPage:   &limit,
		}); err == nil {
			for _, candidate := range *candidates {
				if candidate.GetInput().Equal(scheduler.GetJobInput()) {
					lastRun = candidate
					break
				}
			}
		} else {
			fmt.Errorf("[Highkick] [Schedulers] Can not get last run. %v", err)
		}
	}

	// Init scheduler meta
	{
		schedulerMeta := SchedulerMeta{
			StopChan:  stopChan,
			LastRun:   nil,
			Scheduler: scheduler,
		}
		if lastRun.ID != 0 {
			schedulerMeta.LastRun = &lastRun
		}
		schedulerMetas.Set(scheduler.ID, schedulerMeta)
	}

	switch scheduler.SchedulerType {
	case models.SchedulerTypes.Timer:
		{
			schedulerMeta := schedulerMetas.Get(scheduler.ID)
			ticker := time.NewTicker(time.Duration(scheduler.RunEverySeconds) * time.Second)
			go func() {
				fmt.Printf("[Highkick] [Schedulers] Running %v 333\n", scheduler)
				for {
					select {
					case <-schedulerMeta.StopChan:
						fmt.Printf("[Highkick] [Schedulers] Stopping %v\n", scheduler)
						return
					case <-ticker.C:
						ExecuteScheduler(scheduler)
					}
				}
			}()
		}
	case models.SchedulerTypes.ExactTime:
		{
			fmt.Printf("[Highkick] [Schedulers] Running %v 444\n", scheduler)
			schedulerMeta := schedulerMetas.Get(scheduler.ID)
			ticker := time.NewTicker(10 * time.Second)
			go func() {
				for {
					select {
					case <-schedulerMeta.StopChan:
						fmt.Printf("[Highkick] [Schedulers] Stopping %v\n", scheduler)
						return
					case <-ticker.C:
						{
							if schedulerMeta := schedulerMetas.Get(scheduler.ID); schedulerMeta != nil {
								// Should run few times per minute
								lastRunAt := time.Time{}
								if schedulerMeta.LastRun != nil {
									lastRunAt = schedulerMeta.LastRun.CreatedAt
								}
								nowHHMM := time.Now().Format("15:04") // trigger
								triggeredHHMM := ""
								for _, candidate := range scheduler.ExactTimes {
									if candidate == nowHHMM {
										triggeredHHMM = candidate
										break
									} else if candidate > nowHHMM {
										break // assuming ExaxtTimes is sorted asc
									}
								}
								if triggeredHHMM != "" {
									if !lastRunAt.IsZero() && lastRunAt.Format("15:04") == triggeredHHMM && lastRunAt.Format("2006-01-02") == time.Now().Format("2006-01-02") {
										// double run. skip
									} else {
										ExecuteScheduler(scheduler)
									}
								}
							} else {
								fmt.Printf("[Highkick] [Schedulers] [Error] No meta found for a running exact-time scheduler !!!\n")
							}
						}
					}
				}
			}()
		}
	}
}
