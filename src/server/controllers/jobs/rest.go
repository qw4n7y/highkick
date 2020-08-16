package jobs

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/qw4n7y/highkick/src/repo"
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

	job := repo.GetJobByID(params.JobID)
	jobs := repo.GetJobTree(job)
	for _, j := range jobs {
		if err := repo.DestroyJobLogsFor(j); err != nil {
			c.JSON(422, gin.H{"msg": err})
			return
		}
		if err := repo.DestroyJob(j); err != nil {
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

	job := repo.GetJobByID(params.JobID)
	siblingsStatus := repo.GetSiblingsDetailedStatus(job)
	c.JSON(http.StatusOK, map[string]interface{}{
		"job":      job,
		"siblings": siblingsStatus,
	})
}
