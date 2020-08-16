package repo

import (
	"fmt"
	"strings"

	"github.com/qw4n7y/highkick/src/models"
)

type Filters struct {
	IsRoot       *bool
	IsPeriodical *bool
	Root         *models.Job
	Cron         *string
	Type         *string
	SiblingsOf   *models.Job
}

func (f *Filters) SQLWhereClauses() string {
	clauses := []string{}

	if f.IsRoot != nil {
		if *f.IsRoot == true {
			clauses = append(clauses, "(path = '')")
		} else {
			clauses = append(clauses, "(path != '')")
		}
	}

	if f.IsPeriodical != nil {
		if *f.IsPeriodical == true {
			clauses = append(clauses, "(cron IS NOT NULL)")
		} else {
			clauses = append(clauses, "(cron IS NULL)")
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

	if f.Cron != nil {
		clauses = append(clauses, fmt.Sprintf("(cron = '%v')", *f.Cron))
	}

	if f.Type != nil {
		clauses = append(clauses, fmt.Sprintf("(type = '%v')", *f.Type))
	}

	return strings.Join(clauses, " AND ")
}
