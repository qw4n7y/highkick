package jobs

import (
	"net/http"

	"github.com/qw4n7y/highkick/jobs"
	"github.com/qw4n7y/highkick/models"
	"github.com/qw4n7y/highkick/repository"

	"github.com/gin-gonic/gin"
)

type retryFailedChildrenURIParams struct {
	JobID int32 `uri:"job_id" binding:"required"`
}

// RetryFailedChildren .
func RetryFailedChildren(c *gin.Context) {
	var params retryFailedChildrenURIParams
	if err := c.ShouldBindUri(&params); err != nil {
		c.JSON(422, gin.H{"msg": err})
		return
	}

	job := repository.GetJobByID(params.JobID)
	childrenJobs := repository.GetJobTree(job)
	for _, childJob := range childrenJobs {
		if job.ID == childJob.ID {
			continue
		}

		if childJob.Status == models.StatusFailed {
			jobs.ManagerSingleton.RunJob(childJob)
		}
	}

	c.JSON(http.StatusOK, struct{}{})
}
