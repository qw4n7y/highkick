package database

import (
	"database/sql"
	"fmt"
	"strings"

	"gopkg.in/reform.v1"
)

type Pagination struct {
	Page    int
	PerPage int
}

type QueryBuilder interface {
	Select() *[]string
	ForceIndex() *string
	Where() string
	Join() *string
	OrderBy() *string
	GroupBy() *[]string
	Pagination() *Pagination
}

type Repository struct {
	DB   *reform.DB
	View reform.View
}

func (repo *Repository) GetAll_2(queryBuilder QueryBuilder) (*[]reform.Struct, error) {
	QUERY := ""

	// SELECT
	forceIndex := ""
	if v := queryBuilder.ForceIndex(); v != nil {
		forceIndex = *v
	}

	if selectFields := queryBuilder.Select(); selectFields != nil {
		QUERY = fmt.Sprintf("SELECT %v FROM %v %v", strings.Join(*selectFields, ", "), repo.View.Name(), forceIndex)
	} else {
		QUERY = fmt.Sprintf("SELECT * FROM %v %v", repo.View.Name(), forceIndex)
	}

	if join := queryBuilder.Join(); join != nil {
		QUERY += " " + *join
	}

	if where := queryBuilder.Where(); len(where) > 0 {
		QUERY += " WHERE " + where
	}
	if groupBy := queryBuilder.GroupBy(); groupBy != nil && len(*groupBy) > 0 {
		QUERY += " GROUP BY " + strings.Join(*groupBy, ",")
	}
	if order := queryBuilder.OrderBy(); order != nil {
		QUERY += " ORDER BY " + *order
	}

	if pagination := queryBuilder.Pagination(); pagination != nil {
		offset := (pagination.Page - 1) * pagination.PerPage
		QUERY += fmt.Sprintf(" LIMIT %v OFFSET %v", pagination.PerPage, offset)
	}

	rows, err := repo.DB.Query(QUERY)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	structs := []reform.Struct{}
	for rows.Next() {
		_struct := repo.View.NewStruct()
		pointers := _struct.Pointers()
		if err = rows.Scan(pointers...); err != nil {
			return nil, err
		}
		structs = append(structs, _struct)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}

	return &structs, nil
}

func (repo *Repository) GetAll(queryBuilder QueryBuilder) (*[]reform.Struct, error) {
	tail := ""
	if where := queryBuilder.Where(); len(where) > 0 {
		tail += " WHERE " + where
	}
	if groupBy := queryBuilder.GroupBy(); groupBy != nil && len(*groupBy) > 0 {
		tail += " GROUP BY " + strings.Join(*groupBy, ",")
	}
	if order := queryBuilder.OrderBy(); order != nil {
		tail += " ORDER BY " + *order
	}

	if pagination := queryBuilder.Pagination(); pagination != nil {
		offset := (pagination.Page - 1) * pagination.PerPage
		tail += fmt.Sprintf(" LIMIT %v OFFSET %v", pagination.PerPage, offset)
	}

	rows, err := repo.DB.SelectAllFrom(repo.View, tail)
	if err != nil {
		return nil, err
	}

	return &rows, nil
}

func (repo *Repository) GetFirst(queryBuilder QueryBuilder) (*reform.Struct, error) {
	whereSQL := queryBuilder.Where()
	tail := fmt.Sprintf("WHERE %v", whereSQL)

	row, err := repo.DB.SelectOneFrom(repo.View, tail)
	if err == sql.ErrNoRows {
		return nil, nil
	} else if err != nil {
		return nil, err
	}

	return &row, nil
}

func (repo *Repository) Save(record reform.Record) error {
	return repo.DB.Save(record)
}

func (repo *Repository) BulkInsert(structs []reform.Struct, batchSize int) error {
	for i := 0; i < len(structs)/batchSize+1; i++ {
		low, high := i*batchSize, (i+1)*batchSize
		if high > len(structs) {
			high = len(structs)
		}
		batch := structs[low:high]
		if err := repo.DB.InsertMulti(batch...); err != nil {
			return err
		}
	}
	return nil
}

func (repo *Repository) Destroy(record reform.Record) error {
	return repo.DB.Delete(record)
}

func (repo *Repository) DestroyAll(queryBuilder QueryBuilder) error {
	whereSQL := queryBuilder.Where()
	tail := fmt.Sprintf("WHERE %v", whereSQL)
	_, err := repo.DB.DeleteFrom(repo.View, tail)
	return err
}

func (repo *Repository) UpdateAll(record reform.Record, columns []string, queryBuilder QueryBuilder) error {
	whereSQL := queryBuilder.Where()
	tail := fmt.Sprintf("WHERE %v", whereSQL)
	_, err := repo.DB.UpdateView(record, columns, tail)
	return err
}
