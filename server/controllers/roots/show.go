package roots

import (
	"highkick/repository"

	"net/http"

	"github.com/gin-gonic/gin"
)

type showURIParams struct {
	ID int32 `uri:"id" binding:"required"`
}

// Show is Show
func Show(c *gin.Context) {
	var params showURIParams
	if err := c.ShouldBindUri(&params); err != nil {
		c.JSON(422, gin.H{"msg": err})
		return
	}

	jobs := repository.GetJobTreeByRootID(params.ID)
	c.JSON(http.StatusOK, jobs)
}
