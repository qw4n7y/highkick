package jobs

import (
	"net/http"

	"github.com/qw4n7y/highkick/src/usecases"

	"github.com/qw4n7y/highkick/src/models"
	repo "github.com/qw4n7y/highkick/src/repo/jobs"

	"github.com/gin-gonic/gin"
)

// RetryFailedLeaves .
func RetryFailedLeaves(c *gin.Context) {
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

	treeJobs, err := repo.Repo.Get(repo.QueryBuilder{
		Root: job,
	})
	if err != nil {
		panic(err)
	}

	for _, treeJob := range *treeJobs {
		if job.ID == treeJob.ID {
			continue
		}

		isLeave := true
		for _, treeJob2 := range *treeJobs {
			if treeJob.IsParentOf(treeJob2) {
				isLeave = false
				break
			}
		}

		if !isLeave {
			continue
		}

		if treeJob.Status == models.JobStatuses.Failed {
			go usecases.RunSync(&treeJob)
		}
	}

	c.JSON(http.StatusOK, struct{}{})
}
