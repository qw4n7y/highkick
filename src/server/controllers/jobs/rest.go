package jobs

import (
	"net/http"

	"github.com/gin-gonic/gin"

	jobLogsRepo "github.com/qw4n7y/highkick/src/repo/job_logs"
	repo "github.com/qw4n7y/highkick/src/repo/jobs"
	"github.com/qw4n7y/highkick/src/usecases"
)

// Destroy .
func Destroy(c *gin.Context) {
	params := struct {
		JobID int `uri:"job_id" binding:"required"`
	}{}
	if err := c.ShouldBindUri(&params); err != nil {
		panic(err)
	}

	job, err := repo.GetOne(params.JobID)
	if err != nil {
		panic(err)
	}

	jobs, err := repo.Repo.Get(repo.QueryBuilder{
		SubtreeOf: job,
	})
	if err != nil {
		panic(err)
	}

	for _, j := range *jobs {
		if err := jobLogsRepo.Repo.DestroyAll(jobLogsRepo.QueryBuilder{
			JobID: &j.ID,
		}); err != nil {
			panic(err)
		}
		if err := repo.Repo.Destroy(&j); err != nil {
			panic(err)
		}
	}

	c.JSON(http.StatusOK, struct{}{})
}

// Show .
func Show(c *gin.Context) {
	params := struct {
		JobID int `uri:"job_id" binding:"required"`
	}{}
	if err := c.ShouldBindUri(&params); err != nil {
		panic(err)
	}

	job, err := repo.GetOne(params.JobID)
	if err != nil {
		panic(err)
	}

	siblingsStatus, err := usecases.GetSiblingsDetailedStatus(job)
	if err != nil {
		panic(err)
	}

	c.JSON(http.StatusOK, map[string]interface{}{
		"job":      job,
		"siblings": *siblingsStatus,
	})
}
