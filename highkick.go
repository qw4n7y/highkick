package highkick

import (
	"github.com/qw4n7y/highkick/src/database"
	"github.com/qw4n7y/highkick/src/jobs"
	"github.com/qw4n7y/highkick/src/models"
	"github.com/qw4n7y/highkick/src/server"
)

// Data source names
const (
	DevDatabaseDSN = "root:root@tcp(127.0.0.1:3306)/highkick_dev?clientFoundRows=true&charset=utf8mb4&parseTime=true&multiStatements=true"
)

var manager = jobs.ManagerSingleton

// SetupOptions is options for setup
type SetupOptions = database.SetupOptions

// Setup establishes database connection
var Setup = database.Setup

// NewJob builds new job instance
var NewJob = models.BuildJob

// NewJob builds new periodical job instance
var NewPeriodicalJob = models.NewPeriodicalJob

// Run registers intent to run a new job, validates it can be executed and executes
// it in goroutine
var Run = manager.RunJob

// RunJobCoherently executes job on the fly returning execution results
var RunJobCoherently = manager.RunJobCoherently

// RunWithOneWorkerAtOnce runs the job with one worker at once
var RunWithOneWorkerAtOnce = manager.RunWithOneWorkerAtOnce

// RunWithOneWorkerAtOnceCoherently runs the job in coherent mode with one worker at once
var RunWithOneWorkerAtOnceCoherently = manager.RunWithOneWorkerAtOnceCoherently

// Register registers a worker and associate it with provided string identificator
var Register = manager.RegisterWorker

// SetupServer setup GIN engine for GUI backend
var SetupServer = server.Setup

// Log associates custom message with a jon and persists it to database
var Log = manager.Log

// GetOutput gets string by key from job's dictionary
var GetOutput = manager.GetOutput

// SetOutput preserves string value by key in job's dictionary
var SetOutput = manager.SetOutput

// Input keeps job parameters as JSON-serializable disctionary
type Input = models.JSONDictionary

// Keeps reference to jobs update pubSub
var JobsPubSub = manager.JobsPubSub

// PubSub Message
type PubSubMessage = models.PubSubMessage

// Job is job instance
type Job = models.Job
