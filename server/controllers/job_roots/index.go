package job_roots

import (
	"net/http"

	"github.com/qw4n7y/highkick/repository"

	"github.com/gin-gonic/gin"
)

// Index is Index
func Index(c *gin.Context) {
	roots := repository.GetRootJobs()
	c.JSON(http.StatusOK, roots)
}
