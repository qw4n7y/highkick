package job_roots

import (
	"net/http"
	"strconv"

	"github.com/qw4n7y/highkick/src/usecases"

	jobsRepo "github.com/qw4n7y/highkick/src/repo/jobs"

	"encoding/json"

	"github.com/gin-gonic/gin"
)

// Index is Index
func Index(ctx *gin.Context) {
	page, _ := strconv.Atoi(ctx.Query("page"))
	limit := 50
	truly := true

	qb := jobsRepo.QueryBuilder{}
	if err := json.Unmarshal([]byte(ctx.Query("filters")), &qb); err != nil {
		panic(err)
	}
	qb.Page = &page
	qb.PerPage = &limit
	qb.OrderDesc = &truly
	qb.IsRoot = &truly

	roots, err := jobsRepo.Repo.Get(qb)
	if err != nil {
		panic(err)
	}

	for _, root := range *roots {
		treeStatus, err := usecases.GetJobTreeStatus(root)
		if err != nil {
			panic(err)
		}
		root.TreeStatus = treeStatus
	}

	ctx.JSON(http.StatusOK, roots)
}
