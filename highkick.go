package highkick

import (
	"github.com/qw4n7y/highkick/database"
	"github.com/qw4n7y/highkick/jobs"
	"github.com/qw4n7y/highkick/models"
	"github.com/qw4n7y/highkick/server"
)

// Data source names
const (
	DevDataSourceName  = "root:root@tcp(127.0.0.1:3307)/highkick?clientFoundRows=true&charset=utf8mb4&parseTime=true&multiStatements=true"
	TestDataSourceName = "root:root@tcp(127.0.0.1:3307)/highkick_test?clientFoundRows=true&charset=utf8mb4&parseTime=true&multiStatements=true"
)

// Provide liblary API
var Setup = database.Setup
var NewJob = models.BuildJob
var Run = jobs.ManagerSingleton.RunJob
var Register = jobs.ManagerSingleton.RegisterWorker
var RegisterGuiBackend = server.Register

type Input = models.JSONDictionary
