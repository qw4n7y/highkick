package database

import (
	"database/sql"

	"github.com/qw4n7y/highkick/src/repo/job_logs"
	"github.com/qw4n7y/highkick/src/repo/jobs"
	"github.com/qw4n7y/highkick/src/repo/schedulers"
	"github.com/qw4n7y/highkick/src/repo/workers"
)

// Keeps singleton instance of Manager
var (
	Manager manager
)

type DatabaseEngine string

var DatabaseEngines = struct {
	MySQL   DatabaseEngine
	SQLite3 DatabaseEngine
}{
	MySQL:   "mysql",
	SQLite3: "sqlite3",
}

type DatabaseOptions struct {
	DB            *sql.DB
	Engine        DatabaseEngine
	Database      string
	RunMigrations bool
	EnableLogging bool
}

// Setup inits singleton
func Setup(options DatabaseOptions) {
	Manager.Setup(options)

	jobs.InitializeRepo(Manager.DBR)
	job_logs.InitializeRepo(Manager.DBR)
	schedulers.InitializeRepo(Manager.DBR)
	workers.InitializeRepo(Manager.DBR)
}

// Close closes all connections
func Close() {
	if db := Manager.DB; db != nil {
		db.Close()
	}
}
