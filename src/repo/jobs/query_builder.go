package jobs

import (
	"fmt"
	"strings"

	"github.com/qw4n7y/highkick/src/lib/database"
	"github.com/qw4n7y/highkick/src/models"
)

type QueryBuilder struct {
	ID         *int
	IDLessThan *int
	IDs        *[]int

	IsRoot      *bool
	SubtreeOf   *models.Job
	Type        *string
	JobTypes    *[]string
	JobTypesNot *[]string
	SiblingsOf  *models.Job
	Status      *models.JobStatus
	Statuses    *[]models.JobStatus

	OrderDesc    *bool
	OrderByIDAsc *bool

	Page    *int
	PerPage *int
}

func (f QueryBuilder) Select() *[]string {
	return &[]string{
		"id", "type", "path", "full_path", "sid", "input", "output", "status", "retries_left", "logs_count", "worker_id", "started_at", "finished_at", "created_at",
	}
}

func (f QueryBuilder) ForceIndex() *string {
	forceIndex := fmt.Sprintf("FORCE INDEX (PRIMARY, jobs_fullpath1_idx, jobs_fullpath2_idx, jobs_fullpath3_idx, jobs_fullpath4_idx, jobs_fullpath5_idx, jobs_fullpath6_idx, jobs_fullpath7_idx, jobs_fullpath8_idx, jobs_fullpath9_idx, jobs_fullpath10_idx, jobs_fullpath11_idx, jobs_fullpath12_idx, jobs_fullpath13_idx, jobs_fullpath14_idx, jobs_fullpath15_idx)")
	return &forceIndex
}

func (f QueryBuilder) Join() *string {
	return nil
}

func (f QueryBuilder) Where() string {
	generateFullPathOptions := func(parentID int) []string {
		return []string{
			fmt.Sprintf("full_path1 = %v", parentID),
			fmt.Sprintf("full_path2 = %v", parentID),
			fmt.Sprintf("full_path3 = %v", parentID),
			fmt.Sprintf("full_path4 = %v", parentID),
			fmt.Sprintf("full_path5 = %v", parentID),
			fmt.Sprintf("full_path6 = %v", parentID),
			fmt.Sprintf("full_path7 = %v", parentID),
			fmt.Sprintf("full_path8 = %v", parentID),
			fmt.Sprintf("full_path9 = %v", parentID),
			fmt.Sprintf("full_path10 = %v", parentID),
			fmt.Sprintf("full_path11 = %v", parentID),
			fmt.Sprintf("full_path12 = %v", parentID),
			fmt.Sprintf("full_path13 = %v", parentID),
			fmt.Sprintf("full_path14 = %v", parentID),
			fmt.Sprintf("full_path15 = %v", parentID),
		}
	}

	clauses := []string{"true"}

	if f.ID != nil {
		clauses = append(clauses, fmt.Sprintf("(id = %v)", *f.ID))
	}
	if f.IDLessThan != nil {
		clauses = append(clauses, fmt.Sprintf("(id < %v)", *f.IDLessThan))
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

	if f.SubtreeOf != nil {
		root := *f.SubtreeOf
		// Old way via path and LIKE
		// {
		// 	clauses = append(clauses, fmt.Sprintf(
		// 		`(path LIKE "%v/%v/%%" OR path LIKE "%%/%v/%v/%%" OR path = "%v/%v" OR path LIKE "%v/%%" OR path LIKE "%%/%v/%%" OR path = "%v" OR id = %v)`,
		// 		root.Path, root.ID, root.Path, root.ID, root.Path, root.ID, root.ID, root.ID, root.ID, root.ID,
		// 	))
		// }
		// New way via JSON array and generated columns
		{
			options := generateFullPathOptions(root.ID)
			options = append(options, fmt.Sprintf("id = %v", root.ID))
			clauses = append(clauses, fmt.Sprintf(`( (%v) )`, strings.Join(options, ") OR (")))
		}
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
	if qb.OrderByIDAsc != nil && *qb.OrderByIDAsc == true {
		q := "id ASC"
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
