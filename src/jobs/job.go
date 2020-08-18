package jobs

import (
	"github.com/qw4n7y/highkick/src/models"
)

// Job
type Job struct {
	SID             string
	Title           string
	Perform         func(job *models.Job) error
	InputJSONSchema *string
}

func (job Job) ToContract() map[string]string {
	res := map[string]string{
		"SID":   job.SID,
		"Title": job.Title,
	}
	if job.InputJSONSchema != nil {
		res["InputJSONSchema"] = *job.InputJSONSchema
	}
	return res
}
