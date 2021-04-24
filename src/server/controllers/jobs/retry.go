package jobs

import (
	"net/http"

	"github.com/qw4n7y/highkick/src/usecases"

	repo "github.com/qw4n7y/highkick/src/repo/jobs"

	"github.com/gin-gonic/gin"
)

// Retry is Retry
func Retry(c *gin.Context) {
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

	go usecases.RunSync(job)

	c.JSON(http.StatusOK, struct{}{})
}
