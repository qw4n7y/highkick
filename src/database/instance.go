package database

import (
	"github.com/qw4n7y/highkick/src/repo/job_logs"
	"github.com/qw4n7y/highkick/src/repo/jobs"
	"github.com/qw4n7y/highkick/src/repo/schedulers"
)

// Keeps singleton instance of Manager
var (
	Manager manager
)

type SetupOptions struct {
	RunMigrations bool
}

// Setup inits singleton
func Setup(dataSourceName string, options SetupOptions) {
	Manager.Setup(dataSourceName, options)

	jobs.InitializeRepo(Manager.DBR)
	job_logs.InitializeRepo(Manager.DBR)
	schedulers.InitializeRepo(Manager.DBR)
}

// Close closes all connections
func Close() {
	if db := Manager.DB; db != nil {
		db.Close()
	}
}
