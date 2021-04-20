package server

import (
	"github.com/gin-gonic/gin"
	"github.com/qw4n7y/highkick/src/server/controllers/schedulers"

	"github.com/qw4n7y/highkick/src/server/controllers/job_logs"
	"github.com/qw4n7y/highkick/src/server/controllers/job_metas"
	"github.com/qw4n7y/highkick/src/server/controllers/job_roots"
	"github.com/qw4n7y/highkick/src/server/controllers/jobs"
	"github.com/qw4n7y/highkick/src/server/ws"
)

type RunServerParams struct {
	BasicAuthUser string
	BasicAuthPassword string
}

func RunServer(engine *gin.Engine, params RunServerParams) {
	urlPrefix := "highkick"

	routes := engine.Group(urlPrefix, gin.BasicAuth(gin.Accounts{
		params.BasicAuthUser: params.BasicAuthPassword,
	}))

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

		{
			g := routes.Group("/schedulers")
			g.GET("/index", schedulers.Index)
			g.GET("/show/:id", schedulers.Show)
			g.POST("/create", schedulers.CreateUpdate)
			g.POST("/update/:id", schedulers.CreateUpdate)
			g.DELETE("/destroy/:id", schedulers.Destroy)
		}

		routes.GET("/ws", ws.HttpUpgadeHandler)

		routes.Static("/client", "../client/build")
	}
}
