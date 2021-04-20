package job_metas

import (
	"github.com/qw4n7y/highkick/src/usecases"
	"net/http"

	"github.com/gin-gonic/gin"
)

func Index(c *gin.Context) {
	jobs := usecases.GetJobs()

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
