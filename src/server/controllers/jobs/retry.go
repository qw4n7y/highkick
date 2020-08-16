package jobs

import (
	"net/http"

	"github.com/qw4n7y/highkick/src/jobs"
	"github.com/qw4n7y/highkick/src/repo"

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

	job := repo.GetJobByID(params.JobID)
	jobs.ManagerSingleton.RunJob(job)

	c.JSON(http.StatusOK, struct{}{})
}
