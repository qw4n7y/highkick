package highkick

import (
	"github.com/markbates/pkger"

	"github.com/qw4n7y/highkick/src/database"
	"github.com/qw4n7y/highkick/src/models"
	"github.com/qw4n7y/highkick/src/server"
	"github.com/qw4n7y/highkick/src/usecases"
)

func init() {
	// Include is a no-op that directs the pkger tool to include the desired file or folder.
	pkger.Include("/client/build")
	pkger.Include("/migrations")
}

// Domain
type JobMeta = models.JobMeta
type Job = models.Job
type Input = models.JSONDictionary
type JobsToHandle = models.JobsToHandle
type Worker = models.Worker

var NewJob = models.BuildJob
var Register = usecases.Register
var GetOutput = usecases.GetOutput
var SetOutput = usecases.SetOutput

// Database
type DatabaseOptions = database.DatabaseOptions

var DatabaseEngines = database.DatabaseEngines
var SetupDatabase = database.Setup

// Server
type ServerParams = server.ServerParams

var RunServer = server.RunServer

// Execution
var RunSync = usecases.RunSync
var RunAsync = usecases.RunAsync

// Workers
var RegisterAndRunWorker = usecases.RegisterAndRunWorker
var RunWorkerMonitor = usecases.RunWorkerMonitor

// Scheduling
var RunSchedulers = usecases.RunSchedulers

// Locking
var Lock = usecases.Lock
var Unlock = usecases.Unlock

// Logging
var Log = usecases.Log

// PubSub
type PubSubMessage = models.PubSubMessage

var JobsPubSub = usecases.JobsPubSub
