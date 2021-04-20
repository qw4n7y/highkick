package jobs

import (
	"github.com/qw4n7y/highkick/src/usecases"
	"net/http"

	"github.com/qw4n7y/highkick/src/models"
	"github.com/qw4n7y/highkick/src/repo"

	"github.com/gin-gonic/gin"
)

type retryFailedLeavesURIParams struct {
	JobID int32 `uri:"job_id" binding:"required"`
}

// RetryFailedLeaves .
func RetryFailedLeaves(c *gin.Context) {
	var params retryFailedLeavesURIParams
	if err := c.ShouldBindUri(&params); err != nil {
		c.JSON(422, gin.H{"msg": err})
		return
	}

	job := repo.GetJobByID(params.JobID)
	treeJobs := repo.GetJobTree(job)
	for _, treeJob := range treeJobs {
		if job.ID == treeJob.ID {
			continue
		}

		isLeave := true
		for _, treeJob2 := range treeJobs {
			if treeJob.IsParentOf(treeJob2) {
				isLeave = false
				break
			}
		}

		if !isLeave {
			continue
		}

		if treeJob.Status == models.JobStatuses.Failed {
			go usecases.RunSync(treeJob)
		}
	}

	c.JSON(http.StatusOK, struct{}{})
}
