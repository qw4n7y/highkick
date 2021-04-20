package usecases

import (
	"github.com/qw4n7y/highkick/src/models"
	"sync"
)

var mu sync.RWMutex
var mus map[string]sync.Mutex

func init() {
	mus = map[string]sync.Mutex{}
}

// Allows to lock job's type so only one worker is running at each moment
//
func Lock(job models.Job) {
	mu.RLock()
	_mu := mus[job.Type]
	mu.RUnlock()

	_mu.Lock()
}

func Unlock(job models.Job) {
	mu.RLock()
	_mu := mus[job.Type]
	mu.RUnlock()

	_mu.Unlock()
}