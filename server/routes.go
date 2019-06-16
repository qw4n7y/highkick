package server

import (
	"github.com/gin-gonic/gin"

	"github.com/qw4n7y/highkick/server/controllers/job_logs"
	"github.com/qw4n7y/highkick/server/controllers/job_roots"
	"github.com/qw4n7y/highkick/server/controllers/jobs"
	"github.com/qw4n7y/highkick/server/ws"
)

// Register injects highkick engine to
func Register(e *gin.Engine) {
	routes := e.Group("highkick")
	{
		routes.GET("/job_roots", job_roots.Index)

		routes.DELETE("/jobs/:job_id", jobs.Destroy)
		routes.POST("/jobs/:job_id/retry", jobs.Retry)
		routes.POST("/jobs/:job_id/retry_failed_children", jobs.RetryFailedChildren)
		routes.GET("/jobs/:job_id/subtree", jobs.Subtree)
		routes.GET("/jobs/:job_id/logs", job_logs.Index)

		routes.GET("/jobs/ws", ws.HttpUpgadeHandler)

		routes.Static("/gui", "server/static")
	}
}
