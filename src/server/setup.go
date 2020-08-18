package server

import (
	"github.com/gin-gonic/gin"

	"github.com/qw4n7y/highkick/src/server/controllers/job_logs"
	"github.com/qw4n7y/highkick/src/server/controllers/job_metas"
	"github.com/qw4n7y/highkick/src/server/controllers/job_roots"
	"github.com/qw4n7y/highkick/src/server/controllers/jobs"
	"github.com/qw4n7y/highkick/src/server/ws"
)

// Setup injects highkick engine to
func Setup(engine *gin.Engine) {
	urlPrefix := "highkick"
	routes := engine.Group(urlPrefix)
	{
		routes.GET("/job_roots/index", job_roots.Index)

		routes.GET("/job_metas/index", job_metas.Index)

		routes.POST("/jobs/run", jobs.Run)
		routes.DELETE("/jobs/delete/:job_id", jobs.Destroy)
		routes.POST("/jobs/retry/:job_id/", jobs.Retry)
		routes.POST("/jobs/retry_failed_leaves/:job_id/", jobs.RetryFailedLeaves)
		routes.GET("/jobs/subtree/:job_id", jobs.Subtree)
		routes.GET("/jobs/input/:job_id", jobs.GetInput)
		routes.GET("/jobs/show/:job_id", jobs.Show)

		routes.GET("/job_logs/index/:job_id", job_logs.Index)

		routes.GET("/ws", ws.HttpUpgadeHandler)

		routes.Static("/client", "../client/build")
	}
}
