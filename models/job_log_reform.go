// Code generated by gopkg.in/reform.v1. DO NOT EDIT.

package models

import (
	"fmt"
	"strings"

	"gopkg.in/reform.v1"
	"gopkg.in/reform.v1/parse"
)

type jobLogTableType struct {
	s parse.StructInfo
	z []interface{}
}

// Schema returns a schema name in SQL database ("").
func (v *jobLogTableType) Schema() string {
	return v.s.SQLSchema
}

// Name returns a view or table name in SQL database ("job_logs").
func (v *jobLogTableType) Name() string {
	return v.s.SQLName
}

// Columns returns a new slice of column names for that view or table in SQL database.
func (v *jobLogTableType) Columns() []string {
	return []string{"id", "job_id", "content", "created_at"}
}

// NewStruct makes a new struct for that view or table.
func (v *jobLogTableType) NewStruct() reform.Struct {
	return new(JobLog)
}

// NewRecord makes a new record for that table.
func (v *jobLogTableType) NewRecord() reform.Record {
	return new(JobLog)
}

// PKColumnIndex returns an index of primary key column for that table in SQL database.
func (v *jobLogTableType) PKColumnIndex() uint {
	return uint(v.s.PKFieldIndex)
}

// JobLogTable represents job_logs view or table in SQL database.
var JobLogTable = &jobLogTableType{
	s: parse.StructInfo{Type: "JobLog", SQLSchema: "", SQLName: "job_logs", Fields: []parse.FieldInfo{{Name: "ID", Type: "int32", Column: "id"}, {Name: "JobID", Type: "int32", Column: "job_id"}, {Name: "Content", Type: "string", Column: "content"}, {Name: "CreatedAt", Type: "time.Time", Column: "created_at"}}, PKFieldIndex: 0},
	z: new(JobLog).Values(),
}

// String returns a string representation of this struct or record.
func (s JobLog) String() string {
	res := make([]string, 4)
	res[0] = "ID: " + reform.Inspect(s.ID, true)
	res[1] = "JobID: " + reform.Inspect(s.JobID, true)
	res[2] = "Content: " + reform.Inspect(s.Content, true)
	res[3] = "CreatedAt: " + reform.Inspect(s.CreatedAt, true)
	return strings.Join(res, ", ")
}

// Values returns a slice of struct or record field values.
// Returned interface{} values are never untyped nils.
func (s *JobLog) Values() []interface{} {
	return []interface{}{
		s.ID,
		s.JobID,
		s.Content,
		s.CreatedAt,
	}
}

// Pointers returns a slice of pointers to struct or record fields.
// Returned interface{} values are never untyped nils.
func (s *JobLog) Pointers() []interface{} {
	return []interface{}{
		&s.ID,
		&s.JobID,
		&s.Content,
		&s.CreatedAt,
	}
}

// View returns View object for that struct.
func (s *JobLog) View() reform.View {
	return JobLogTable
}

// Table returns Table object for that record.
func (s *JobLog) Table() reform.Table {
	return JobLogTable
}

// PKValue returns a value of primary key for that record.
// Returned interface{} value is never untyped nil.
func (s *JobLog) PKValue() interface{} {
	return s.ID
}

// PKPointer returns a pointer to primary key field for that record.
// Returned interface{} value is never untyped nil.
func (s *JobLog) PKPointer() interface{} {
	return &s.ID
}

// HasPK returns true if record has non-zero primary key set, false otherwise.
func (s *JobLog) HasPK() bool {
	return s.ID != JobLogTable.z[JobLogTable.s.PKFieldIndex]
}

// SetPK sets record primary key.
func (s *JobLog) SetPK(pk interface{}) {
	if i64, ok := pk.(int64); ok {
		s.ID = int32(i64)
	} else {
		s.ID = pk.(int32)
	}
}

// check interfaces
var (
	_ reform.View   = JobLogTable
	_ reform.Struct = (*JobLog)(nil)
	_ reform.Table  = JobLogTable
	_ reform.Record = (*JobLog)(nil)
	_ fmt.Stringer  = (*JobLog)(nil)
)

func init() {
	parse.AssertUpToDate(&JobLogTable.s, new(JobLog))
}
