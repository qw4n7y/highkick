package jobs

// Manager is Manager
type Manager struct {
	workers map[string]Worker
}

func (m *Manager) RunJob() {
}

func (m *Manager) CompleteJob() {
}

// RegisterWorker registers worker for specified jobType
func (m *Manager) RegisterWorker(jobType string, worker Worker) {
	m.workers[jobType] = worker
}
