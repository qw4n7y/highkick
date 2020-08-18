package job_metas

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/qw4n7y/highkick/src/jobs"
)

func Index(c *gin.Context) {
	jobs := jobs.GetJobs()

	contracts := []map[string]string{}
	for _, job := range jobs {
		contract := job.ToContract()
		contracts = append(contracts, contract)
	}
	// siblingsStatus := repo.GetSiblingsDetailedStatus(job)
	c.JSON(http.StatusOK, map[string]interface{}{
		"items": contracts,
	})
}
