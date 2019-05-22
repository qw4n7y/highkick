package server

import (
	"github.com/gin-gonic/gin"

	"github.com/qw4n7y/highkick/server/controllers/job_logs"
	"github.com/qw4n7y/highkick/server/controllers/job_roots"
	"github.com/qw4n7y/highkick/server/controllers/jobs"
)

// Register injects highkick engine to
func Register(e *gin.Engine) {
	routes := e.Group("highkick")
	{
		routes.GET("/job_roots", job_roots.Index)

		routes.POST("/jobs/:job_id/retry", jobs.Retry)
		routes.GET("/jobs/:job_id/subtree", jobs.Subtree)
		routes.GET("/jobs/:job_id/logs", job_logs.Index)

		routes.Static("/gui", "server/static")
	}
}
