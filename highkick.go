package highkick

import (
	"github.com/qw4n7y/highkick/database"
	"github.com/qw4n7y/highkick/jobs"
	"github.com/qw4n7y/highkick/models"
	"github.com/qw4n7y/highkick/server"
)

// Data source names
const (
	TestDataSourceName = "root:root@tcp(127.0.0.1:3307)/highkick_test?clientFoundRows=true&charset=utf8mb4&parseTime=true&multiStatements=true"
)

// Setup establishes database connection
var Setup = database.Setup

// NewJob builds new job instance
var NewJob = models.BuildJob

// Run registers intent to run a new job, validates it can be executed and executes
// it in goroutine
var Run = jobs.ManagerSingleton.RunJob

// Register registers a worker and associate it with provided string identificator
var Register = jobs.ManagerSingleton.RegisterWorker

// RegisterGuiBackendHandler setup GIN handlers for GUI backend to /highkick
var RegisterGuiBackendHandler = server.Register

// Log associates custom message with a jon and persists it to database
var Log = jobs.ManagerSingleton.Log

// Input keeps job parameters as JSON-serializable disctionary
type Input = models.JSONDictionary

// Job is job instance
type Job = models.Job
