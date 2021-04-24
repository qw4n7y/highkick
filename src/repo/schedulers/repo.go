package schedulers

import (
	"fmt"

	"gopkg.in/reform.v1"

	"github.com/qw4n7y/highkick/src/lib/database"
	"github.com/qw4n7y/highkick/src/models"
)

type repo struct {
	database.Repository
}

// Quick
func GetOne(id int) (*models.Scheduler, error) {
	record, err := Repo.GetFirst(QueryBuilder{ID: &id})
	if err != nil {
		return nil, err
	}
	if record == nil {
		return nil, fmt.Errorf("No record found")
	}
	model, err := Repo.UnmarshalRecord(record)
	if err != nil {
		return nil, err
	}
	return &model, nil
}

func (r *repo) Get(qb QueryBuilder) (*[]models.Scheduler, error) {
	records, err := r.GetAll(qb)
	if err != nil {
		return nil, err
	}
	models, err := r.UnmarshalRecords(records)
	if err != nil {
		return nil, err
	}
	return &models, nil
}

// Would love to have generics support in Go

func (r *repo) UnmarshalRecord(record *reform.Struct) (models.Scheduler, error) {
	if record == nil {
		return models.Scheduler{}, nil
	}
	model, ok := (*record).(*models.Scheduler)
	if ok {
		return *model, nil
	} else {
		return models.Scheduler{}, fmt.Errorf("Can not cast %+v to models.Scheduler", record)
	}
}

func (r *repo) UnmarshalRecords(records *[]reform.Struct) ([]models.Scheduler, error) {
	models := []models.Scheduler{}
	for _, record := range *records {
		if model, err := r.UnmarshalRecord(&record); err == nil {
			models = append(models, model)
		} else {
			return models, err
		}
	}
	return models, nil
}

var (
	Repo repo
)

func InitializeRepo(dbr *reform.DB) {
	Repo = repo{
		database.Repository{
			DB:   dbr,
			View: models.SchedulerTable,
		},
	}
	fmt.Println("[Repo] [Schedulers] Initialized")
}
