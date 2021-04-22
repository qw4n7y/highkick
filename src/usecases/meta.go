package usecases

import (
	"strings"
	"sync"

	"github.com/qw4n7y/highkick/src/models"
)

var jobMetas map[string]models.JobMeta

func init() {
	jobMetas = map[string]models.JobMeta{}
}

// Register registers worker for specified jobType
func Register(jobMeta models.JobMeta) {
	if jobMeta.InputJSONSchema != nil {
		sanitized := strings.ReplaceAll(strings.ReplaceAll(*jobMeta.InputJSONSchema, "\t", ""), "\n", "")
		jobMeta.InputJSONSchema = &sanitized
	}
	jobMeta.MU = sync.Mutex{}

	jobMetas[jobMeta.SID] = jobMeta
}

// UnregisterAll unregisters all jobs
func UnregisterAll() {
	jobMetas = make(map[string]models.JobMeta)
}

func GetJobs() []models.JobMeta {
	result := []models.JobMeta{}
	for _, j := range jobMetas {
		result = append(result, j)
	}
	return result
}
