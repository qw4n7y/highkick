package jobs

import (
	"fmt"

	"github.com/qw4n7y/highkick/src/models"
	"github.com/qw4n7y/highkick/src/usecases"
	"github.com/tidwall/gjson"

	jobLogsRepo "github.com/qw4n7y/highkick/src/repo/job_logs"
	jobsRepo "github.com/qw4n7y/highkick/src/repo/jobs"
)

const HIGHKICK_CLEAN_UP = "HIGHKICK/CLEAN_UP"

func init() {
	inputJSONSchema := `{
		"type": "object",
		"properties": {
			"NewestJobsCountToKeep": { "type": "number" }
		},
		"required": ["NewestJobsCountToKeep"]
	}`
	usecases.Register(models.JobMeta{
		SID:             HIGHKICK_CLEAN_UP,
		Title:           HIGHKICK_CLEAN_UP,
		Perform:         CleanUpWorker,
		InputJSONSchema: &inputJSONSchema,
	})
}

func CleanUpWorker(job *models.Job) error {
	for _, key := range []string{"NewestJobsCountToKeep"} {
		if !gjson.Get(*job.Input, key).Exists() {
			return fmt.Errorf("%v is required", key)
		}
	}
	newestJobsCountToKeep := int(gjson.Get(*job.Input, "NewestJobsCountToKeep").Int())

	// same as offset!
	page := newestJobsCountToKeep
	perPage := 1
	truly := true

	thresholdJobs, err := jobsRepo.Repo.Get(jobsRepo.QueryBuilder{
		Page:      &page,
		PerPage:   &perPage,
		OrderDesc: &truly,
	})
	if err != nil {
		return err
	}
	if (len(*thresholdJobs)) == 0 {
		usecases.Log(job, fmt.Sprintf("Jobs count is less than %v", newestJobsCountToKeep))
		return nil
	}

	thresholdJob := (*thresholdJobs)[0]
	usecases.Log(job, fmt.Sprintf("Threshold job id = %v", thresholdJob.ID))

	if err := jobLogsRepo.Repo.DestroyAll(jobLogsRepo.QueryBuilder{
		JobIDLessThan: &thresholdJob.ID,
	}); err != nil {
		return err
	}
	usecases.Log(job, fmt.Sprintf("Job logs: cleaned up"))

	if err := jobsRepo.Repo.DestroyAll(jobsRepo.QueryBuilder{
		IDLessThan: &thresholdJob.ID,
	}); err != nil {
		return err
	}
	usecases.Log(job, fmt.Sprintf("Jobs: cleaned up"))

	return nil
}
