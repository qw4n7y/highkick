package workers

import (
	"fmt"

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
