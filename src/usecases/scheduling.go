package usecases

import (
	"fmt"
	"github.com/qw4n7y/highkick/src/models"
	"github.com/qw4n7y/highkick/src/repo"
	"sync"
	"time"
)

type SchedulerMeta struct {
	StopChan chan bool
	UpdatedAt time.Time
	ID int
}

var schedulerMetas = sync.Map{}

func loadSchedulerMeta(schedulerID int) *SchedulerMeta {
	p, ok := schedulerMetas.Load(schedulerID)
	if (!ok) { return nil }
	schedulerMeta, ok := p.(SchedulerMeta)
	if !ok {
		panic("[HIGHKICK] Weird, should never happen: Can not convert to SchedulerMeta\n")
	}
	return &schedulerMeta
}

func RunSchedulers() {
	fmt.Printf("[HIGHKICK] Schedulers started\n")
	go func(){
		every := 30 * time.Second
		for {
			prevSchedulerIDs := []int{}
			schedulerMetas.Range(func(key interface{}, value interface{}) bool {
				schedulerID := key.(int)
				prevSchedulerIDs = append(prevSchedulerIDs, schedulerID)
				return true
			})

			schedulers, err := repo.GetSchedulers()
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
		StopChan: stopChan,
		UpdatedAt: scheduler.UpdatedAt,
		ID: scheduler.ID,
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
					repo.UpdateScheduler(&scheduler, []string{"last_run_at", "last_error"})
				}
			}
		}
	}()
}



