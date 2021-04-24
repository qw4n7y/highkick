package schedulers

import (
	"fmt"
	"strings"

	"github.com/qw4n7y/highkick/src/lib/database"
)

type QueryBuilder struct {
	ID *int
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
