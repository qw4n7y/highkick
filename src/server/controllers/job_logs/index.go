package job_logs

import (
	"encoding/json"
	"net/http"

	"github.com/qw4n7y/highkick/src/models"
	jobLogsRepo "github.com/qw4n7y/highkick/src/repo/job_logs"

	"github.com/gin-gonic/gin"
)

// Index is Index
func Index(c *gin.Context) {
	// Parse input
	qb := jobLogsRepo.QueryBuilder{}
	if err := json.Unmarshal([]byte(c.Query("filters")), &qb); err != nil {
		panic(err)
	}

	items, err := jobLogsRepo.Repo.Get(qb)
	if err != nil {
		panic(err)
	}

	c.JSON(http.StatusOK, struct {
		Items []models.JobLog
	}{
		Items: *items,
	})
}
