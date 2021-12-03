package jobs

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
func GetOne(id int) (*models.Job, error) {
	one := 1
	records, err := Repo.GetAll_2(QueryBuilder{
		ID:      &id,
		Page:    &one,
		PerPage: &one,
	})
	if err != nil {
		return nil, err
	}
	if records == nil || len(*records) == 0 {
		return nil, fmt.Errorf("No record found")
	}
	record := (*records)[0]
	model, err := Repo.UnmarshalRecord(&record)
	if err != nil {
		return nil, err
	}
	return &model, nil
}

func (r *repo) Get(qb QueryBuilder) (*[]models.Job, error) {
	records, err := r.GetAll_2(qb)
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

func (r *repo) UnmarshalRecord(record *reform.Struct) (models.Job, error) {
	if record == nil {
		return models.Job{}, nil
	}
	model, ok := (*record).(*models.Job)
	if !ok {
		return models.Job{}, fmt.Errorf("Can not cast %+v to models.Job", record)
	}
	if err := model.UnpackOutDb(); err != nil {
		return models.Job{}, err
	}
	return *model, nil
}

func (r *repo) UnmarshalRecords(records *[]reform.Struct) ([]models.Job, error) {
	models := []models.Job{}
	for _, record := range *records {
		if model, err := r.UnmarshalRecord(&record); err == nil {
			models = append(models, model)
		} else {
			return models, err
		}
	}
	return models, nil
}

func (r *repo) Save2(model *models.Job) error {
	if err := model.PackIntoDb(); err != nil {
		return err
	}
	return r.Repository.Save(model)
}

var (
	Repo repo
)

func InitializeRepo(dbr *reform.DB) {
	Repo = repo{
		database.Repository{
			DB:   dbr,
			View: models.JobTable,
		},
	}
	fmt.Println("[Repo] [Jobs] Initialized")
}
