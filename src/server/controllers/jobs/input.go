package jobs

import (
	"github.com/qw4n7y/highkick/src/repo"

	"net/http"

	"github.com/gin-gonic/gin"
)

// GetInput
func GetInput(c *gin.Context) {
	params := struct {
		JobID int32 `uri:"job_id" binding:"required"`
	}{}
	if err := c.ShouldBindUri(&params); err != nil {
		c.JSON(422, gin.H{"msg": err})
		return
	}

	job := repo.GetJobByID(params.JobID)
	input := job.Input
	c.JSON(http.StatusOK, input)
}
