package highkick // import "github.com/qw4n7y/highkick"


CONSTANTS

const (
	TestDataSourceName = "root:root@tcp(127.0.0.1:3307)/highkick_test?clientFoundRows=true&charset=utf8mb4&parseTime=true&multiStatements=true"
)
    Data source names


VARIABLES

var JobsPubSub = jobs.ManagerSingleton.JobsPubSub
    Keeps reference to jobs update pubSub

var Log = jobs.ManagerSingleton.Log
    Log associates custom message with a jon and persists it to database

var NewJob = models.BuildJob
    NewJob builds new job instance

var Register = jobs.ManagerSingleton.RegisterWorker
    Register registers a worker and associate it with provided string
    identificator

var RegisterGuiBackendHandler = server.Register
    RegisterGuiBackendHandler setup GIN handlers for GUI backend to /highkick

var Run = jobs.ManagerSingleton.RunJob
    Run registers intent to run a new job, validates it can be executed and
    executes it in goroutine

var Setup = database.Setup
    Setup establishes database connection


TYPES

type Input = models.JSONDictionary
    Input keeps job parameters as JSON-serializable disctionary

type Job = models.Job
    Job is job instance

