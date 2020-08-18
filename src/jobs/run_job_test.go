package jobs

import (
	"errors"
	"strings"
	"testing"
	"time"

	"github.com/qw4n7y/highkick"
	"github.com/qw4n7y/highkick/src/database"
	"github.com/qw4n7y/highkick/src/models"
	"github.com/qw4n7y/highkick/src/repo"
)

func TestSimpleUsage(t *testing.T) {
	database.Setup(highkick.DevDatabaseDSN, database.SetupOptions{
		RunMigrations: false,
	})
	database.Manager.TruncateDatabase()

	UnregisterAll()

	counter := 0
	workersCount := 0

	worker := func(job *models.Job) error {
		input := job.GetInput()
		counter += int(input["value"].(float64)) // Why float64?

		if workersCount < 10 {
			RunJob(models.BuildJob("increment", models.JSONDictionary{
				"value": 10,
			}, job))

			workersCount++
			return nil
		}

		return errors.New("Oops")
	}
	Register("increment", Job{
		Title:   "Increment",
		Perform: worker,
	})

	rootJob := RunJob(models.BuildJob("increment", models.JSONDictionary{
		"value": 10,
	}, nil))

	time.Sleep(100 * time.Millisecond)

	want := 110
	if counter != want {
		t.Errorf("Want %v Got %v", want, counter)
	}

	jobs := repo.GetJobs(repo.Filters{}, "ORDER BY path ASC")
	if len(jobs) != 11 {
		t.Errorf("Total jobs created: Want %v Got %v", 11, len(jobs))
	}

	rootJob = repo.GetJobByID(rootJob.ID)
	if rootJob.Status != "failed" {
		t.Errorf("Root job: Want %v Got %v", "failed", rootJob.Status)
	}

	lastJob := jobs[len(jobs)-1]
	rootLogs := repo.GetJobLogs(lastJob)
	lastLog := rootLogs[len(rootLogs)-1]
	if !strings.Contains(lastLog.Content, "[ERROR] Recovered panic: Oops") {
		t.Errorf("Last Log of the last Job: Want %v Got %v", "[ERROR] Recovered panic: Oops", lastLog)
	}
}
