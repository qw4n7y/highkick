package server

import (
	"github.com/gin-gonic/gin"

	"highkick/server/controllers/roots"
)

// Setup injects highkick engine to
func Setup(e *gin.Engine) {
	routes := e.Group("highkick")
	{
		routes.GET("/roots", roots.Index)
		routes.GET("/roots/:id", roots.Show)
	}
}
