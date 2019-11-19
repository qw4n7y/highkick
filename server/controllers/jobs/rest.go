package jobs

import (
	"net/http"

	"github.com/qw4n7y/highkick/repository"

	"github.com/gin-gonic/gin"
)

type instanceURIParams struct {
	JobID int32 `uri:"job_id" binding:"required"`
}

// Destroy .
func Destroy(c *gin.Context) {
	var params instanceURIParams
	if err := c.ShouldBindUri(&params); err != nil {
		c.JSON(422, gin.H{"msg": err})
		return
	}

	job := repository.GetJobByID(params.JobID)
	jobs := repository.GetJobTree(job)
	for _, j := range jobs {
		if err := repository.DestroyJobLogsFor(j); err != nil {
			c.JSON(422, gin.H{"msg": err})
			return
		}
		if err := repository.DestroyJob(j); err != nil {
			c.JSON(422, gin.H{"msg": err})
			return
		}
	}

	c.JSON(http.StatusOK, struct{}{})
}

// Show .
func Show(c *gin.Context) {
	var params instanceURIParams
	if err := c.ShouldBindUri(&params); err != nil {
		c.JSON(422, gin.H{"msg": err})
		return
	}

	job := repository.GetJobByID(params.JobID)
	c.JSON(http.StatusOK, job)
}
