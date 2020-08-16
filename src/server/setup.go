package server

import (
	"github.com/gin-gonic/gin"

	"github.com/qw4n7y/highkick/src/server/controllers/job_logs"
	"github.com/qw4n7y/highkick/src/server/controllers/job_roots"
	"github.com/qw4n7y/highkick/src/server/controllers/jobs"
	"github.com/qw4n7y/highkick/src/server/ws"
)

// Setup injects highkick engine to
func Setup(engine *gin.Engine) {
	urlPrefix := "highkick"
	routes := engine.Group(urlPrefix)
	{
		routes.GET("/job_roots", job_roots.Index)

		routes.DELETE("/jobs/:job_id", jobs.Destroy)
		routes.POST("/jobs/:job_id/retry", jobs.Retry)
		routes.POST("/jobs/:job_id/retry_failed_leaves", jobs.RetryFailedLeaves)
		routes.GET("/jobs/:job_id/subtree", jobs.Subtree)
		routes.GET("/jobs/:job_id/input", jobs.GetInput)
		routes.GET("/jobs/:job_id/logs", job_logs.Index)
		routes.GET("/jobs/:job_id/show", jobs.Show)

		routes.GET("/ws", ws.HttpUpgadeHandler)

		routes.Static("/client", "../client/static")
	}
}
