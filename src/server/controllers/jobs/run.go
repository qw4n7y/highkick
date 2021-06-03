package jobs

import (
	"net/http"

	"github.com/qw4n7y/highkick/src/usecases"

	"github.com/qw4n7y/highkick/src/models"

	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
)

func Run(c *gin.Context) {
	input := struct {
		SID   string                `binding:"required"`
		Input models.JSONDictionary `binding:"required"`
	}{}
	err := c.ShouldBindBodyWith(&input, binding.JSON)
	if err != nil {
		panic(err)
	}

	job := models.BuildJob(input.SID, input.Input, nil)
	if err := usecases.RunAsync(job); err != nil {
		panic(err)
	}

	c.JSON(http.StatusOK, map[string]interface{}{
		"job": job,
	})
}
