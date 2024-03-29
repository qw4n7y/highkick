package workers

import (
	"fmt"
	"strings"

	"github.com/qw4n7y/highkick/src/lib/database"
)

type QueryBuilder struct {
	ID      *int
	SID     *string
	Stopped *bool
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
	if f.SID != nil {
		clauses = append(clauses, fmt.Sprintf("(sid = '%v')", *f.SID))
	}
	if f.Stopped != nil {
		switch *f.Stopped {
		case true:
			clauses = append(clauses, fmt.Sprintf("(stopped = 1)"))
		case false:
			clauses = append(clauses, fmt.Sprintf("(stopped = 0)"))
		}
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
