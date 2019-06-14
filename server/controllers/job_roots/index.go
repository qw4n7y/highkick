package job_roots

import (
	"net/http"
	"strconv"

	"github.com/qw4n7y/highkick/repository"

	"github.com/gin-gonic/gin"
)

// Index is Index
func Index(c *gin.Context) {
	page, _ := strconv.Atoi(c.Query("page"))
	limit := 25

	roots := repository.GetRootJobs(page, limit)
	c.JSON(http.StatusOK, roots)
}
