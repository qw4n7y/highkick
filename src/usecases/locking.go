package usecases

import (
	"sync"

	"github.com/qw4n7y/highkick/src/models"
)

var mus = sync.Map{}

// Allows to lock job's type so only one worker is running at each moment
//
func Lock(job models.Job) {
	muInt, _ := mus.LoadOrStore(job.Type, &sync.Mutex{})
	mu := muInt.(*sync.Mutex)
	mu.Lock()
}

func Unlock(job models.Job) {
	muInt, _ := mus.LoadOrStore(job.Type, &sync.Mutex{})
	mu := muInt.(*sync.Mutex)
	mu.Unlock()
}
