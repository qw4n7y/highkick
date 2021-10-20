package models

import (
	"time"
)

//go:generate reform
//reform:highkick_workers
type Worker struct {
	ID               int       `reform:"id,pk"`
	SID              string    `reform:"sid"`
	ProcessSID       string    `reform:"process_sid"`
	Stopped          bool      `reform:"stopped"`
	RunningJobsCount int       `reform:"running_jobs_count"`
	HealthcheckedAt  time.Time `reform:"healthchecked_at"`
	CreatedAt        time.Time `reform:"created_at"`
}

func (s *Worker) BeforeInsert() error {
	s.HealthcheckedAt = time.Now()
	s.CreatedAt = time.Now()
	return nil
}
