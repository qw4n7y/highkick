package models

import (
	"encoding/json"
	"time"
)

//go:generate reform
//reform:highkick_schedulers
type Scheduler struct {
	ID              int        `reform:"id,pk"`
	JobType         string     `reform:"job_type"`
	JobInput        string     `reform:"job_input"`
	RunEverySeconds int        `reform:"run_every_seconds"`
	Stopped         bool       `reform:"stopped"`
	UpdatedAt       time.Time  `reform:"updated_at"`
	LastRunAt       *time.Time `reform:"last_run_at"`
	LastError       string     `reform:"last_error"`
}

func (s *Scheduler) BeforeInsert() error {
	s.UpdatedAt = time.Now()
	return nil
}

func (s *Scheduler) BeforeUpdate() error {
	s.UpdatedAt = time.Now()
	return nil
}

// GetInput is getter for Input
func (s *Scheduler) GetJobInput() JSONDictionary {
	var dict JSONDictionary
	_ = json.Unmarshal([]byte(s.JobInput), &dict)
	return dict
}
