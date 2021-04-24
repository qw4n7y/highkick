package server

import (
	"net/http"
	"net/url"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/markbates/pkger"
	"github.com/qw4n7y/highkick/src/server/controllers/schedulers"

	"github.com/qw4n7y/highkick/src/server/controllers/job_logs"
	"github.com/qw4n7y/highkick/src/server/controllers/job_metas"
	"github.com/qw4n7y/highkick/src/server/controllers/job_roots"
	"github.com/qw4n7y/highkick/src/server/controllers/jobs"
	"github.com/qw4n7y/highkick/src/server/ws"
)

type RunServerParams struct {
	AuthMiddleware *gin.HandlerFunc
	ClientURL      string
}

func RunServer(engine *gin.Engine, params RunServerParams) {
	// CLIENT

	{
		clientHandler := http.FileServer(pkger.Dir("/client/build"))
		urlPrefix := params.ClientURL
		if !strings.HasSuffix(urlPrefix, "/") {
			urlPrefix += "/"
		}
		engine.Any(urlPrefix+"*path", func(ctx *gin.Context) {
			urlWithoutPrefix, err := url.Parse(ctx.Param("path"))
			if err != nil {
				ctx.JSON(500, map[string]string{
					"error": err.Error(),
				})
				return
			}
			ctx.Request.URL = urlWithoutPrefix

			clientHandler.ServeHTTP(ctx.Writer, ctx.Request)
		})
	}

	// SERVER

	// unauthorized
	unauthorized := engine.Group("highkick")
	unauthorized.GET("/jobs/show/:job_id", jobs.Show)
	unauthorized.GET("/ws", ws.HttpUpgadeHandler)
	// engine.Static("/highkick/client", "../client/build")

	// authorized
	authorized := engine.Group("highkick")
	if params.AuthMiddleware != nil {
		authorized.Use(*params.AuthMiddleware)
	}

	{
		g := authorized.Group("/jobs")
		g.POST("/run", jobs.Run)
		g.DELETE("/delete/:job_id", jobs.Destroy)
		g.POST("/retry/:job_id/", jobs.Retry)
		g.POST("/retry_failed_leaves/:job_id/", jobs.RetryFailedLeaves)
		g.GET("/subtree/:job_id", jobs.Subtree)
		g.GET("/input/:job_id", jobs.GetInput)
	}

	{
		authorized.GET("/job_roots/index", job_roots.Index)
		authorized.GET("/job_metas/index", job_metas.Index)
		authorized.GET("/job_logs/index/:job_id", job_logs.Index)
	}

	{
		g := authorized.Group("/schedulers")
		g.GET("/index", schedulers.Index)
		g.GET("/show/:id", schedulers.Show)
		g.POST("/create", schedulers.CreateUpdate)
		g.POST("/update/:id", schedulers.CreateUpdate)
		g.DELETE("/destroy/:id", schedulers.Destroy)
	}
}
