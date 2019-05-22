package job_logs

import (
	"net/http"

	"github.com/qw4n7y/highkick/repository"

	"github.com/gin-gonic/gin"
)

type indexURIParams struct {
	JobID int32 `uri:"job_id" binding:"required"`
}

// Index is Index
func Index(c *gin.Context) {
	var params indexURIParams
	if err := c.ShouldBindUri(&params); err != nil {
		c.JSON(422, gin.H{"msg": err})
		return
	}

	job := repository.GetJobByID(params.JobID)
	logs := repository.GetJobLogs(job)

	c.JSON(http.StatusOK, logs)
}
