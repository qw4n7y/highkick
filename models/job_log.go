package models

import (
	"time"
)

// JobLog is JobLog
//
//go:generate reform
//reform:job_logs
type JobLog struct {
	ID        int32     `reform:"id,pk"`
	JobID     int32     `reform:"job_id"`
	JobPath   string    `reform:"job_path"`
	Content   string    `reform:"content"`
	CreatedAt time.Time `reform:"created_at"`
}
