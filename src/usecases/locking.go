package usecases

import (
	"fmt"

	"github.com/qw4n7y/highkick/src/models"
)

// Allows to lock job's type so only one worker is running at each moment
//
func Lock(job models.Job) {
	jobMeta, ok := jobMetas[job.Type]
	if !ok {
		panic(fmt.Errorf("[Highkick] [Locking] No Job meta found: %+v", job.Type))
	}
	jobMeta.MU.Lock()
}

func Unlock(job models.Job) {
	jobMeta, ok := jobMetas[job.Type]
	if !ok {
		panic(fmt.Errorf("[Highkick] [Locking] No Job meta found: %+v", job.Type))
	}
	jobMeta.MU.Unlock()
}
