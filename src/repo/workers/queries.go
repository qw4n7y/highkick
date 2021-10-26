package workers

import (
	"fmt"
	"time"

	"github.com/qw4n7y/highkick/src/models"
)

func IncrementRunningJobsCount(workerID int, incr int) error {
	q := fmt.Sprintf("UPDATE %v SET running_jobs_count = running_jobs_count + (%v) WHERE id = %v", models.WorkerTable.Name(), incr, workerID)
	fmt.Println(">>>", q)
	if _, err := Repo.DB.Exec(q); err != nil {
		return err
	}
	return nil
}

func TrachHealthcheckTimestamp(workerID int) error {
	q := fmt.Sprintf("UPDATE %v SET healthchecked_at = '%v' WHERE id = %v", models.WorkerTable.Name(), time.Now().UTC().Format("2006-01-02 15:04:05"), workerID)
	fmt.Println(">>>", q)
	if _, err := Repo.DB.Exec(q); err != nil {
		return err
	}
	return nil
}
