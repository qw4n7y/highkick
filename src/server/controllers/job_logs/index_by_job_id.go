package job_logs

import (
	"net/http"

	jobLogsRepo "github.com/qw4n7y/highkick/src/repo/job_logs"

	"github.com/gin-gonic/gin"
)

// Index is Index
func IndexByJobID(c *gin.Context) {
	params := struct {
		JobID int `uri:"job_id" binding:"required"`
	}{}
	if err := c.ShouldBindUri(&params); err != nil {
		c.JSON(422, gin.H{"msg": err})
		return
	}

	logs, err := jobLogsRepo.Repo.Get(jobLogsRepo.QueryBuilder{
		JobID: &params.JobID,
	})
	if err != nil {
		panic(err)
	}

	c.JSON(http.StatusOK, logs)
}
