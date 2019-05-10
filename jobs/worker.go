package jobs

import (
	"sidekiq/models"
)

// Worker is job processing handler
type Worker = func(manager *Manager, job *models.Job)
