package jobs

import (
	"fmt"
	"strings"

	"github.com/qw4n7y/highkick/src/lib/database"
	"github.com/qw4n7y/highkick/src/models"
)

type QueryBuilder struct {
	ID         *int
	IsRoot     *bool
	Root       *models.Job
	Type       *string
	SiblingsOf *models.Job
	Status     *models.JobStatus

	OrderDesc *bool

	Page    *int
	PerPage *int
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

	if f.IsRoot != nil {
		if *f.IsRoot == true {
			clauses = append(clauses, "(path = '')")
		} else {
			clauses = append(clauses, "(path != '')")
		}
	}

	if f.Root != nil {
		root := *f.Root
		clauses = append(clauses, fmt.Sprintf(
			`(path LIKE "%v/%v/%%" OR path LIKE "%v/%%" OR path = "%v" OR id = %v)`,
			root.Path, root.ID, root.ID, root.ID, root.ID,
		))
	}

	if f.SiblingsOf != nil {
		root := *f.SiblingsOf
		clauses = append(clauses, fmt.Sprintf(
			`(path = "%v/%v" OR path = "%v")`,
			root.Path, root.ID, root.ID,
		))
	}

	if f.Type != nil {
		clauses = append(clauses, fmt.Sprintf("(type = '%v')", *f.Type))
	}

	if f.Status != nil {
		clauses = append(clauses, fmt.Sprintf("(status = '%v')", *f.Status))
	}

	return strings.Join(clauses, " AND ")
}

func (qb QueryBuilder) GroupBy() *[]string {
	return nil
}

func (qb QueryBuilder) OrderBy() *string {
	if qb.OrderDesc != nil && *qb.OrderDesc == true {
		q := "id DESC"
		return &q
	}
	return nil
}

func (qb QueryBuilder) Pagination() *database.Pagination {
	if qb.Page != nil && qb.PerPage != nil {
		return &database.Pagination{
			Page:    *qb.Page,
			PerPage: *qb.PerPage,
		}
	}
	return nil
}
