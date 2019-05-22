package jobs

import (
	"highkick"
	"highkick/database"
	"highkick/models"
	"testing"
	"time"
)

func TestSimpleUsage(t *testing.T) {
	database.Setup(highkick.TestDataSourceName)
	database.Manager.TruncateDatabase()

	m := &ManagerSingleton
	m.UnregisterAllWorkers()

	counter := 0

	worker := func(manager *Manager, job *models.Job) error {
		input := job.GetInput()
		counter += int(input["value"].(float64)) // Why float64?
		return nil
	}
	m.RegisterWorker("increment", worker)

	job := models.BuildJob("increment", models.JSONDictionary{
		"value": 10,
	}, nil)
	m.RunJob(job)

	time.Sleep(50 * time.Millisecond)

	rows, _ := database.Manager.DB.Query("SELECT * FROM jobs")
	cols, _ := rows.Columns()
	for rows.Next() {
		cells := make([]interface{}, len(cols))
		cellsPointers := make([]interface{}, len(cols))
		for i := range cells {
			cellsPointers[i] = &cells[i]
		}

		rows.Scan(cellsPointers...)
	}

	want := 10
	if counter != want {
		t.Errorf("Want %v Got %v", want, counter)
	}
}
