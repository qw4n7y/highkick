package models

import (
	"encoding/json"
	"time"

	"github.com/qw4n7y/highkick/src/lib/database"
)

type SchedulerType string

var SchedulerTypes = struct {
	Timer     SchedulerType
	ExactTime SchedulerType
}{
	Timer:     "timer",
	ExactTime: "exact_time",
}

//go:generate reform
//reform:highkick_schedulers
type Scheduler struct {
	ID       int    `reform:"id,pk"`
	JobType  string `reform:"job_type"`
	JobInput string `reform:"job_input"`

	SchedulerType SchedulerType `reform:"scheduler_type"`
	// Timer
	RunEverySeconds int `reform:"run_every_seconds"`
	// Exact time
	ExactTimes database.StringList `reform:"exact_times"`

	Stopped   bool      `reform:"stopped"`
	UpdatedAt time.Time `reform:"updated_at"`

	WorkerID int // Keeps the reference to assigned worker

	LastRunAt *time.Time `reform:"last_run_at"`
	LastError string     `reform:"last_error"`
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

func (a Scheduler) Equal(b Scheduler) bool {
	return (a.JobType == b.JobType &&
		a.JobInput == b.JobInput &&
		a.ExactTimes.Equal(b.ExactTimes) &&
		a.SchedulerType == b.SchedulerType &&
		a.RunEverySeconds == b.RunEverySeconds)
}
