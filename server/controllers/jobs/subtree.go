package jobs

import (
	"github.com/qw4n7y/highkick/repository"

	"net/http"

	"github.com/gin-gonic/gin"
)

type subtreeURIParams struct {
	JobID int32 `uri:"job_id" binding:"required"`
}

// Subtree is Subtree
func Subtree(c *gin.Context) {
	var params subtreeURIParams
	if err := c.ShouldBindUri(&params); err != nil {
		c.JSON(422, gin.H{"msg": err})
		return
	}

	job := repository.GetJobByID(params.JobID)
	jobs := repository.GetJobTree(job)
	c.JSON(http.StatusOK, jobs)
}
