package highkick

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

func Hello(c *gin.Context) {
	_, offset := time.Now().Zone()

	c.JSON(http.StatusOK, struct {
		ServerTime        string
		UTCTimeZoneOffset int
	}{
		ServerTime:        time.Now().Format("2006-01-02 15:04:05"),
		UTCTimeZoneOffset: offset,
	})
}
