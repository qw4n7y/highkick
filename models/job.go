package models

import (
	"encoding/json"
	"fmt"
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
	ID          int32     `reform:"id,pk" json:"id"`
	Type        string    `reform:"type" json:"type"`
	Path        string    `reform:"path" json:"path"`
	Sid         *string   `reform:"sid" json:"sid"`
	Input       *string   `reform:"input" json:"-"`
	Output      *string   `reform:"output" json:"output"`
	Status      string    `reform:"status" json:"status"`
	TreeStatus  *string   `json:"treeStatus"`
	RetriesLeft int32     `reform:"retries_left" json:"retriesLeft"`
	CreatedAt   time.Time `reform:"created_at" json:"createdAt"`
}

// GetInput is getter for Input
func (job *Job) GetInput() JSONDictionary {
	var dict JSONDictionary
	_ = json.Unmarshal([]byte(*job.Input), &dict)
	return dict
}

// SetInput is setter for Input
func (job *Job) SetInput(dict JSONDictionary) string {
	valueAsBytes, _ := json.Marshal(dict)
	value := string(valueAsBytes)
	job.Input = &value
	return value
}

// GetOutput is getter for Output
func (job *Job) GetOutput() JSONDictionary {
	dict := JSONDictionary{}
	if job.Output == nil {
		return dict
	}
	_ = json.Unmarshal([]byte(*job.Output), &dict)
	return dict
}

// SetOutput is setter for Output
func (job *Job) SetOutput(dict JSONDictionary) string {
	valueAsBytes, _ := json.Marshal(dict)
	value := string(valueAsBytes)
	job.Input = &value
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
	if parent == nil {
		return
	}
	parentIDString := strconv.Itoa(int(parent.ID))
	if parent.Path == "" {
		job.Path = parentIDString
	} else {
		job.Path = strings.Join([]string{parent.Path, parentIDString}, "/")
	}
}

// IsRoot returns whether the job is root or not
func (job *Job) IsRoot() bool {
	_, hasRoot := job.GetRootID()
	return !hasRoot
}

// IsCompleted returns if job is completed
func (job *Job) IsCompleted() bool {
	return job.Status == StatusCompleted || job.Status == StatusFailed
}

// IsFailed returns if job is failed
func (job *Job) IsFailed() bool {
	return job.Status == StatusFailed
}

// BuildJob is a builder helper
func BuildJob(jobType string, input JSONDictionary, parent *Job) *Job {
	job := &Job{
		Type: jobType,
	}
	job.SetInput(input)
	job.SetParent(parent)
	return job
}

func (job *Job) IsParentOf(childJob *Job) bool {
	pathWithParentID := strings.Trim(fmt.Sprintf("%v/%v", job.Path, job.ID), "/")
	return strings.Contains(childJob.Path, pathWithParentID)
}

func (job *Job) IsChildOf(parentJob *Job) bool {
	pathWithParentID := strings.Trim(fmt.Sprintf("%v/%v", parentJob.Path, parentJob.ID), "/")
	return strings.Contains(job.Path, pathWithParentID)
}
