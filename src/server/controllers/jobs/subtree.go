package jobs

import (
	repo "github.com/qw4n7y/highkick/src/repo/jobs"

	"net/http"

	"github.com/gin-gonic/gin"
)

// Subtree is Subtree
func Subtree(c *gin.Context) {
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

	jobs, err := repo.Repo.Get(repo.QueryBuilder{
		Root: job,
	})
	if err != nil {
		panic(err)
	}

	c.JSON(http.StatusOK, *jobs)
}
