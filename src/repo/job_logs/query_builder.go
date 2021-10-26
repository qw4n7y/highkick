package job_logs

import (
	"fmt"
	"strings"
	"time"

	"github.com/qw4n7y/highkick/src/lib/database"
)

type QueryBuilder struct {
	ID      *int
	JobID   *int
	IDSince *int
	Since   *time.Time
	Till    *time.Time
	Limit   *int
}

func (f QueryBuilder) Select() *[]string {
	return nil
}

func (f QueryBuilder) Join() *string {
	return nil
}

func (f QueryBuilder) Where() string {
	clauses := []string{"true"}

	if f.ID != nil {
		clauses = append(clauses, fmt.Sprintf("(id = %v)", *f.ID))
	}
	if f.IDSince != nil {
		clauses = append(clauses, fmt.Sprintf("(id >= %v)", *f.IDSince))
	}
	if f.Since != nil {
		clauses = append(clauses, fmt.Sprintf("(created_at >= '%v')", f.Since.Format("2006-01-02 15:04:05")))
	}
	if f.Till != nil {
		clauses = append(clauses, fmt.Sprintf("(created_at <= '%v')", f.Till.Format("2006-01-02 15:04:05")))
	}

	if f.JobID != nil {
		clauses = append(clauses, fmt.Sprintf("(job_id = %v)", *f.JobID))
	}

	return strings.Join(clauses, " AND ")
}

func (qb QueryBuilder) GroupBy() *[]string {
	return nil
}

func (qb QueryBuilder) OrderBy() *string {
	orderBy := "id ASC"
	return &orderBy
}

func (qb QueryBuilder) Pagination() *database.Pagination {
	if qb.Limit == nil {
		return nil
	}
	return &database.Pagination{
		PerPage: *qb.Limit,
		Page:    1,
	}
}
