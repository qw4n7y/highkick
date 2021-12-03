package jobs

import (
	"fmt"
	"strconv"
	"strings"

	"github.com/qw4n7y/highkick/src/models"
	"github.com/qw4n7y/highkick/src/usecases"
	"github.com/tidwall/gjson"

	jobsRepo "github.com/qw4n7y/highkick/src/repo/jobs"
)

const HIGHKICK_RECALCULATE_FULL_PATH = "HIGHKICK/RECALCULATE_FULL_PATH"

func init() {
	inputJSONSchema := `{
		"type": "object",
		"properties": {},
		"required": []
	}`
	usecases.Register(models.JobMeta{
		SID:             HIGHKICK_RECALCULATE_FULL_PATH,
		Title:           HIGHKICK_RECALCULATE_FULL_PATH,
		Perform:         RecalculateFullPathWorker,
		InputJSONSchema: &inputJSONSchema,
	})
}

func RecalculateFullPathWorker(job *models.Job) error {
	for _, key := range []string{} {
		if !gjson.Get(*job.Input, key).Exists() {
			return fmt.Errorf("%v is required", key)
		}
	}

	page := 1
	perPage := 1000
	truly := true
	for {
		jobs, err := jobsRepo.Repo.Get(jobsRepo.QueryBuilder{
			Page:         &page,
			PerPage:      &perPage,
			OrderByIDAsc: &truly,
		})
		if err != nil {
			return err
		}

		for _, job := range *jobs {
			fullPath := []int{}
			fullPathParts := strings.Split(job.Path, "/")
			for _, part := range fullPathParts {
				if part == "" || part == "0" {
					continue
				}
				v, err := strconv.ParseInt(part, 10, 64)
				if err != nil {
					return err
				}
				fullPath = append(fullPath, int(v))
			}
			job.FullPath = fullPath
			if err := jobsRepo.Repo.Save2(&job); err != nil {
				return err
			}
		}

		if len(*jobs) == 0 {
			break
		}
		usecases.Log(job, fmt.Sprintf("%v processed", page*perPage))
		page = page + 1
	}

	return nil
}
