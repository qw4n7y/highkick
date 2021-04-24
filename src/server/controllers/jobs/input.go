package jobs

import (
	repo "github.com/qw4n7y/highkick/src/repo/jobs"

	"net/http"

	"github.com/gin-gonic/gin"
)

// GetInput
func GetInput(c *gin.Context) {
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
	input := job.Input
	c.JSON(http.StatusOK, input)
}
