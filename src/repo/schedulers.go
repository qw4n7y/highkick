package repo

import (
	"fmt"

	"github.com/qw4n7y/highkick/src/database"
	"github.com/qw4n7y/highkick/src/models"
)

func GetSchedulers() (*[]models.Scheduler, error) {
	dbr := database.Manager.DBR

	sql := fmt.Sprintf("WHERE true")
	rows, err := dbr.SelectAllFrom(models.SchedulerTable, sql)
	if err != nil {
		return nil, err
	}

	items := make([]models.Scheduler, len(rows))
	for i, row := range rows {
		model := row.(*models.Scheduler)
		items[i] = *model
	}

	return &items, nil
}

func GetScheduler(id int) *models.Scheduler {
	dbr := database.Manager.DBR

	row, err := dbr.SelectOneFrom(models.SchedulerTable, "WHERE id = ?", id)
	if err != nil {
		panic(err)
	}

	model := row.(*models.Scheduler)
	return model
}

func SaveScheduler(scheduler *models.Scheduler) error {
	dbr := database.Manager.DBR
	err := dbr.Save(scheduler)
	return err
}

func UpdateScheduler(scheduler *models.Scheduler, fields []string) error {
	dbr := database.Manager.DBR
	err := dbr.UpdateColumns(scheduler, fields...)
	return err
}

func DestroyScheduler(scheduler *models.Scheduler) error {
	dbr := database.Manager.DBR
	err := dbr.Delete(scheduler)
	return err
}
