package jobs

import "strings"

// Register registers worker for specified jobType
func Register(job Job) {
	if job.InputJSONSchema != nil {
		sanitized := strings.ReplaceAll(strings.ReplaceAll(*job.InputJSONSchema, "\t", ""), "\n", "")
		job.InputJSONSchema = &sanitized
	}

	if jobs == nil {
		jobs = make(map[string]Job)
	}
	jobs[job.SID] = job
}

// UnregisterAll unregisters all jobs
func UnregisterAll() {
	jobs = make(map[string]Job)
}

func GetJobs() []Job {
	result := []Job{}
	for _, j := range jobs {
		result = append(result, j)
	}
	return result
}
