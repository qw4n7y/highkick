package job_roots

import (
	"net/http"

	"github.com/qw4n7y/highkick/src/models"
	jobsRepo "github.com/qw4n7y/highkick/src/repo/jobs"
	"github.com/qw4n7y/highkick/src/usecases"

	"encoding/json"

	"github.com/gin-gonic/gin"
)

// Index is Index
func Active(ctx *gin.Context) {
	// Parse input
	qb := jobsRepo.QueryBuilder{}
	if err := json.Unmarshal([]byte(ctx.Query("filters")), &qb); err != nil {
		panic(err)
	}

	// Get all active job nodes
	activeJobs, err := jobsRepo.Repo.Get(jobsRepo.QueryBuilder{
		Statuses: &[]models.JobStatus{models.JobStatuses.Processing, models.JobStatuses.Scheduled, models.JobStatuses.Initial},
	})
	if err != nil {
		panic(err)
	}

	// Extend active root ids to query builder
	childStatusForRootID := map[int]models.JobStatus{}
	rootJobIDsMap := map[int]bool{}
	for _, activeJob := range *activeJobs {
		rootID := activeJob.GetRootID()
		rootJobIDsMap[rootID] = true
		childStatusForRootID[rootID] = activeJob.Status
	}
	rootJobIDs := []int{}
	for rootJobID, _ := range rootJobIDsMap {
		rootJobIDs = append(rootJobIDs, rootJobID)
	}
	qb.IDs = &rootJobIDs

	truly := true
	qb.IsRoot = &truly

	roots, err := jobsRepo.Repo.Get(qb)
	if err != nil {
		panic(err)
	}

	items := []models.Job{}
	for _, root := range *roots {
		// Strategy A
		// Resolve from child statuses
		childStatus := childStatusForRootID[root.ID]
		root.TreeStatus = &childStatus

		// Strategy B
		// Resolve for each root node separatly
		// treeStatus, err := usecases.GetJobTreeStatus(root)
		// if err != nil {
		// 	panic(err)
		// }
		// root.TreeStatus = treeStatus

		items = append(items, root)
	}

	// Get meta info
	childrenStats := []usecases.ChildrenStat{}
	for _, item := range items {
		childrenStat, err := usecases.GetChildrenStat(&item)
		if err != nil {
			panic(err)
		}
		childrenStats = append(childrenStats, *childrenStat)
	}

	ctx.JSON(http.StatusOK, struct {
		Items         []models.Job
		ChildrenStats []usecases.ChildrenStat
	}{
		Items:         items,
		ChildrenStats: childrenStats,
	})
}
