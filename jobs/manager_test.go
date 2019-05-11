package jobs

import (
	"highkick"
	"highkick/database"
	"testing"
)

func TestJobsUsage(t *testing.T) {
	database.Setup(highkick.TestDataSourceName)
	database.Manager.TruncateDatabase()
}
