package jobs

import (
	"github.com/qw4n7y/highkick/src/models"
	repo "github.com/qw4n7y/highkick/src/repo/jobs"

	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
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
	input := job.GetInput()
	c.JSON(http.StatusOK, input)
}

// GetInput
func UpdateInput(c *gin.Context) {
	params := struct {
		JobID int `uri:"job_id" binding:"required"`
	}{}
	if err := c.ShouldBindUri(&params); err != nil {
		panic(err)
	}

	input := struct {
		Input models.JSONDictionary `binding:"required"`
	}{}
	err := c.ShouldBindBodyWith(&input, binding.JSON)
	if err != nil {
		panic(err)
	}

	job, err := repo.GetOne(params.JobID)
	if err != nil {
		panic(err)
	}
	job.PRIVATE_SetInput(input.Input)
	if err := repo.Repo.Save(job); err != nil {
		panic(err)
	}

	c.JSON(http.StatusOK, nil)
}
