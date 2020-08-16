package jobs

import (
	"github.com/qw4n7y/highkick/src/models"
)

// Worker is job processing handler
type Worker = func(job *models.Job) error