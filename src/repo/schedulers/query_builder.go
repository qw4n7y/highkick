package schedulers

import (
	"fmt"
	"strings"

	"github.com/qw4n7y/highkick/src/lib/database"
	"github.com/qw4n7y/highkick/src/models"
)

type QueryBuilder struct {
	ID            *int
	JobTypes      *[]string
	JobTypesNot   *[]string
	SchedulerType *models.SchedulerType
}

func (f QueryBuilder) Select() *[]string {
	return nil
}

func (f QueryBuilder) ForceIndex() *string {
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
	if f.JobTypes != nil && len(*f.JobTypes) > 0 {
		escaped := []string{}
		for _, jobType := range *f.JobTypes {
			escaped = append(escaped, fmt.Sprintf(`"%v"`, jobType))
		}
		clauses = append(clauses, fmt.Sprintf("job_type IN (%v)", strings.Join(escaped, ", ")))
	}
	if f.JobTypesNot != nil && len(*f.JobTypesNot) > 0 {
		escaped := []string{}
		for _, jobType := range *f.JobTypesNot {
			escaped = append(escaped, fmt.Sprintf(`"%v"`, jobType))
		}
		clauses = append(clauses, fmt.Sprintf("job_type NOT IN (%v)", strings.Join(escaped, ", ")))
	}
	if f.SchedulerType != nil {
		clauses = append(clauses, fmt.Sprintf("scheduler_type = '%v'", *f.SchedulerType))
	}

	return strings.Join(clauses, " AND ")
}

func (qb QueryBuilder) GroupBy() *[]string {
	return nil
}

func (qb QueryBuilder) OrderBy() *string {
	return nil
}

func (qb QueryBuilder) Pagination() *database.Pagination {
	return nil
}
