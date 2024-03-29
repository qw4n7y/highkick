package models

import (
	"encoding/json"
	"fmt"
	"strconv"
	"strings"
	"time"
)

type JobStatus string

var JobStatuses = struct {
	Scheduled  JobStatus
	Initial    JobStatus
	Processing JobStatus
	Failed     JobStatus
	Completed  JobStatus
}{
	Scheduled:  "scheduled",
	Initial:    "initial",
	Processing: "processing",
	Failed:     "failed",
	Completed:  "completed",
}

//go:generate reform
//reform:jobs
type Job struct {
	ID   int    `reform:"id,pk" json:"id"`
	Type string `reform:"type" json:"type"`

	Path                 string `reform:"path" json:"path"`
	FullPathJSONAsString string `reform:"full_path" json:"-"`
	FullPath             []int

	Sid         *string    `reform:"sid" json:"sid"`
	Input       *string    `reform:"input" json:"-"`
	Output      *string    `reform:"output" json:"output"`
	Status      JobStatus  `reform:"status" json:"status"`
	TreeStatus  *JobStatus `json:"treeStatus"`
	RetriesLeft int        `reform:"retries_left" json:"retriesLeft"`
	LogsCount   int        `reform:"logs_count" json:"logsCount"`
	WorkerID    int        `reform:"worker_id"`
	StartedAt   *time.Time `reform:"started_at"`
	FinishedAt  *time.Time `reform:"finished_at"`
	CreatedAt   time.Time  `reform:"created_at" json:"createdAt"`
}

func (job Job) FullPathWithoutZeros() []int {
	result := []int{}
	for _, v := range job.FullPath {
		if v == 0 {
			continue
		}
		result = append(result, v)
	}
	return result
}

func (job Job) FullPathWithZeros(n int) []int {
	result := job.FullPath
	for i := 0; i < n-len(job.FullPath); i++ {
		result = append(result, 0)
	}
	return result
}

func (job *Job) UnpackOutDb() error {
	if err := json.Unmarshal([]byte(job.FullPathJSONAsString), &job.FullPath); err != nil {
		return err
	}
	return nil
}

func (job *Job) PackIntoDb() error {
	if jsonBytes, err := json.Marshal(job.FullPathWithZeros(15)); err == nil {
		job.FullPathJSONAsString = string(jsonBytes)
		return nil
	} else {
		return err
	}
}

// GetInput is getter for Input
func (job *Job) GetInput() JSONDictionary {
	var dict JSONDictionary
	_ = json.Unmarshal([]byte(*job.Input), &dict)
	return dict
}

// SetInput is setter for Input
func (job *Job) PRIVATE_SetInput(dict JSONDictionary) string {
	valueAsBytes, _ := json.Marshal(dict)
	value := string(valueAsBytes)
	job.Input = &value
	return value
}

// GetOutput is getter for Output
func (job *Job) PRIVATE_GetOutput() JSONDictionary {
	dict := JSONDictionary{}
	if job.Output == nil {
		return dict
	}
	_ = json.Unmarshal([]byte(*job.Output), &dict)
	return dict
}

// SetOutput is setter for Output
func (job *Job) PRIVATE_SetOutput(dict JSONDictionary) string {
	valueAsBytes, _ := json.Marshal(dict)
	value := string(valueAsBytes)
	job.Output = &value
	return value
}

// GetRootID returns root ID for this job's tree
func (job *Job) GetRootID() int {
	if job.Path == "" {
		return job.ID
	}
	ids := strings.Split(job.Path, "/")
	rootID, _ := strconv.Atoi(ids[0])
	return rootID
}

// SetParent initialize job's path by it's parent
func (job *Job) PRIVATE_SetParent(parent *Job) {
	if parent == nil {
		return
	}

	// Path
	{
		parentIDString := fmt.Sprintf("%v", parent.ID)
		if parent.Path == "" {
			job.Path = parentIDString
		} else {
			job.Path = strings.Join([]string{parent.Path, parentIDString}, "/")
		}
	}

	// Full path
	{
		job.FullPath = append(parent.FullPathWithoutZeros(), parent.ID)
	}
}

// IsRoot returns whether the job is root or not
func (job *Job) IsRoot() bool {
	rootJobID := job.GetRootID()
	return rootJobID == job.ID
}

// IsCompleted returns if job is completed
func (job *Job) IsCompleted() bool {
	return job.Status == JobStatuses.Completed || job.Status == JobStatuses.Failed
}

// IsFailed returns if job is failed
func (job *Job) IsFailed() bool {
	return job.Status == JobStatuses.Failed
}

// NewJob is a builder helper
func NewJob(jobType string, input JSONDictionary, parent *Job) Job {
	job := Job{
		Type: jobType,
	}
	job.PRIVATE_SetInput(input)
	job.PRIVATE_SetParent(parent)
	return job
}

func (job *Job) IsParentOf(childJob Job) bool {
	pathWithParentID := strings.Trim(fmt.Sprintf("%v/%v", job.Path, job.ID), "/")
	return strings.Contains(childJob.Path, pathWithParentID)
}

func (job *Job) IsChildOf(parentJob Job) bool {
	pathWithParentID := strings.Trim(fmt.Sprintf("%v/%v", parentJob.Path, parentJob.ID), "/")
	return strings.Contains(job.Path, pathWithParentID)
}

func (job *Job) Identificator() string {
	if job.Input != nil {
		return fmt.Sprintf("%s-%+v", job.Type, *job.Input)
	}
	return fmt.Sprintf("%s", job.Type)
}
