package jobs

import (
	"highkick/jobs"
	"highkick/repository"
	"net/http"

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
