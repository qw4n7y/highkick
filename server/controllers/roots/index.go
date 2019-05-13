package roots

import (
	"highkick/repository"
	"net/http"

	"github.com/gin-gonic/gin"
)

// Index is Index
func Index(c *gin.Context) {
	roots := repository.GetRootJobs()
	c.JSON(http.StatusOK, roots)
}
