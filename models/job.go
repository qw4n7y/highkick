package models

import (
	"encoding/json"
	"strconv"
	"strings"
	"time"
)

// Is there better way to support enums?
const (
	StatusInitial    = "initial"
	StatusProcessing = "processing"
	StatusFailed     = "failed"
	StatusCompleted  = "completed"
)

// Job is Job
// I've found this interesting: https://golang.org/pkg/database/sql/#Rows.Scan
//
//go:generate reform
//reform:jobs
type Job struct {
	ID          int32     `reform:"id,pk"`
	Type        string    `reform:"type"`
	Path        string    `reform:"path"`
	Sid         string    `reform:"sid"`
	Input       string    `reform:"input"`
	Output      *string   `reform:"output"`
	Status      string    `reform:"status"`
	RetriesLeft int32     `reform:"retries_left"`
	CreatedAt   time.Time `reform:"created_at"`
}

// GetInput is getter for Input
func (job *Job) GetInput() JSONDictionary {
	var dict JSONDictionary
	_ = json.Unmarshal([]byte(job.Input), &dict)
	return dict
}

// SetInput is setter for Input
func (job *Job) SetInput(dict JSONDictionary) string {
	valueAsBytes, _ := json.Marshal(dict)
	value := string(valueAsBytes)
	job.Input = value
	return value
}

// GetRootID returns root ID for this job's tree
func (job *Job) GetRootID() (int32, bool) {
	if job.Path == "" {
		return 0, false
	}
	ids := strings.Split(job.Path, "/")
	rootID, _ := strconv.Atoi(ids[0])
	return int32(rootID), true
}

// SetParent initialize job's path by it's parent
func (job *Job) SetParent(parent *Job) {
	parentIDString := strconv.Itoa(int(parent.ID))
	if parent.Path == "" {
		job.Path = parentIDString
	} else {
		job.Path = strings.Join([]string{parent.Path, parentIDString}, "/")
	}
}
