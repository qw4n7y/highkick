package jobs

import (
	"github.com/qw4n7y/highkick/src/usecases"
	"net/http"

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
	go usecases.RunSync(job)

	c.JSON(http.StatusOK, struct{}{})
}
