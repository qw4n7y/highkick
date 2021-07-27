package jobs

import (
	"fmt"
	"strings"

	"github.com/qw4n7y/highkick/src/lib/database"
	"github.com/qw4n7y/highkick/src/models"
)

type QueryBuilder struct {
	ID          *int
	IDs         *[]int
	IsRoot      *bool
	Root        *models.Job
	SubtreeOf   *models.Job
	Type        *string
	JobTypes    *[]string
	JobTypesNot *[]string
	SiblingsOf  *models.Job
	Status      *models.JobStatus
	Statuses    *[]models.JobStatus

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

	if f.IDs != nil {
		escaped := []string{}
		for _, v := range *f.IDs {
			escaped = append(escaped, fmt.Sprintf(`%v`, v))
		}
		clauses = append(clauses, fmt.Sprintf("id IN (%v)", strings.Join(escaped, ", ")))
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

	if f.SubtreeOf != nil {
		root := *f.SubtreeOf
		clauses = append(clauses, fmt.Sprintf(
			`(path LIKE "%v/%v/%%" OR path LIKE "%%/%v/%v/%%" OR path = "%v/%v" OR path LIKE "%v/%%" OR path LIKE "%%/%v/%%" OR path = "%v" OR id = %v)`,
			root.Path, root.ID, root.Path, root.ID, root.Path, root.ID, root.ID, root.ID, root.ID, root.ID,
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

	if f.Statuses != nil {
		escaped := []string{}
		for _, v := range *f.Statuses {
			escaped = append(escaped, fmt.Sprintf(`"%v"`, v))
		}
		clauses = append(clauses, fmt.Sprintf("status IN (%v)", strings.Join(escaped, ", ")))
	}

	if f.JobTypes != nil && len(*f.JobTypes) > 0 {
		escaped := []string{}
		for _, jobType := range *f.JobTypes {
			escaped = append(escaped, fmt.Sprintf(`"%v"`, jobType))
		}
		clauses = append(clauses, fmt.Sprintf("type IN (%v)", strings.Join(escaped, ", ")))
	}

	if f.JobTypesNot != nil && len(*f.JobTypesNot) > 0 {
		escaped := []string{}
		for _, jobType := range *f.JobTypesNot {
			escaped = append(escaped, fmt.Sprintf(`"%v"`, jobType))
		}
		clauses = append(clauses, fmt.Sprintf("type NOT IN (%v)", strings.Join(escaped, ", ")))
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
