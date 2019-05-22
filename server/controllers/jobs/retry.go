package jobs

import (
	"net/http"

	"github.com/qw4n7y/highkick/jobs"
	"github.com/qw4n7y/highkick/repository"

	"github.com/gin-gonic/gin"
)

type retryURIParams struct {
	JobID int32 `uri:"job_id" binding:"required"`
}

// Retry is Retry
func Retry(c *gin.Context) {
	var params retryURIParams
	if err := c.ShouldBindUri(&params); err != nil {
		c.JSON(422, gin.H{"msg": err})
		return
	}

	job := repository.GetJobByID(params.JobID)
	jobs.ManagerSingleton.RunJob(job)

	c.JSON(http.StatusOK, struct{}{})
}
