package jobs

import (
	"fmt"
	"net/http"

	"github.com/qw4n7y/highkick/src/jobs"
	"github.com/qw4n7y/highkick/src/models"

	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
)

type Input struct {
	SID   string                `binding:"required"`
	Input models.JSONDictionary `binding:"required"`
}

func Run(c *gin.Context) {
	var input Input
	err := c.ShouldBindBodyWith(&input, binding.JSON)
	if err != nil {
		c.JSON(422, gin.H{"msg": err})
		return
	}

	fmt.Printf(">>> %+v\n\n\n", input)

	job := models.BuildJob(input.SID, input.Input, nil)
	job = jobs.RunJob(job)

	c.JSON(http.StatusOK, map[string]interface{}{
		"job": job,
	})
}
