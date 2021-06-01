package usecases

import (
	"fmt"
	"log"
	"sync"
	"time"

	"github.com/qw4n7y/highkick/src/models"
	schedulersRepo "github.com/qw4n7y/highkick/src/repo/schedulers"
)

type SchedulerMeta struct {
	StopChan  chan bool
	UpdatedAt time.Time
	ID        int
}

var schedulerMetas = sync.Map{}

func loadSchedulerMeta(schedulerID int) *SchedulerMeta {
	p, ok := schedulerMetas.Load(schedulerID)
	if !ok {
		return nil
	}
	schedulerMeta, ok := p.(SchedulerMeta)
	if !ok {
		panic("[HIGHKICK] Weird, should never happen: Can not convert to SchedulerMeta\n")
	}
	return &schedulerMeta
}

func RunSchedulers(jobsToHandle models.JobsToHandle) {
	fmt.Printf("[HIGHKICK] Schedulers started\n")
	go func() {
		every := 30 * time.Second
		for {
			prevSchedulerIDs := []int{}
			schedulerMetas.Range(func(key interface{}, value interface{}) bool {
				schedulerID := key.(int)
				prevSchedulerIDs = append(prevSchedulerIDs, schedulerID)
				return true
			})

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
				currentSchedulerIDs[scheduler.ID] = true
				if scheduler.Stopped {
					stopScheduler(scheduler.ID)
					continue
				}
				schedulerMeta := loadSchedulerMeta(scheduler.ID)
				if schedulerMeta != nil {
					// model was changed
					if schedulerMeta.UpdatedAt != scheduler.UpdatedAt {
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
		fmt.Printf("[HIGHKICK] Schedulers stopped\n")
	}()
}

func stopScheduler(schedulerID int) {
	schedulerMeta := loadSchedulerMeta(schedulerID)
	if schedulerMeta != nil {
		schedulerMeta.StopChan <- true
		close(schedulerMeta.StopChan)
	}
	schedulerMetas.Delete(schedulerID)
}

func runScheduler(scheduler models.Scheduler) {
	stopChan := make(chan bool)

	schedulerMeta := SchedulerMeta{
		StopChan:  stopChan,
		UpdatedAt: scheduler.UpdatedAt,
		ID:        scheduler.ID,
	}
	schedulerMetas.Store(scheduler.ID, schedulerMeta)

	go func() {
		ticker := time.NewTicker(time.Duration(scheduler.RunEverySeconds) * time.Second)
		for {
			select {
			case <-stopChan:
				return
			case <-ticker.C:
				{
					job := models.BuildJob(scheduler.JobType, scheduler.GetJobInput(), nil)
					err := RunSync(job)

					now := time.Now()
					scheduler.LastRunAt = &now
					if err != nil {
						scheduler.LastError = fmt.Sprintf("%+v", err)
					} else {
						scheduler.LastError = ""
					}

					if err := schedulersRepo.Repo.UpdateAll(&scheduler, []string{"last_run_at", "last_error"}, schedulersRepo.QueryBuilder{
						ID: &scheduler.ID,
					}); err != nil {
						log.Fatalln(err)
					}
				}
			}
		}
	}()
}
