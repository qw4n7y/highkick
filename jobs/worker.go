package jobs

import (
	"highkick/models"
)

// Worker is job processing handler
type Worker = func(manager *Manager, job *models.Job) error
