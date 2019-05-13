// package highkick

package main

import (
	"errors"
	"fmt"
	"highkick/database"
	"highkick/jobs"
	"highkick/models"
	"highkick/server"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

// Data source names
const (
	DevDataSourceName  = "root:root@tcp(127.0.0.1:3307)/highkick?clientFoundRows=true&charset=utf8mb4&parseTime=true&multiStatements=true"
	TestDataSourceName = "root:root@tcp(127.0.0.1:3307)/highkick_test?clientFoundRows=true&charset=utf8mb4&parseTime=true&multiStatements=true"
)

func testJobsUsage() {
	counter := 0
	flag := false

	var increment jobs.Worker
	increment = func(m *jobs.Manager, job *models.Job) error {
		input := job.GetInput()
		fmt.Println(">>> JOB increment", input)
		m.Log(job, ";)")

		counter += int(input["value"].(float64)) // Why float64?

		if !flag {
			job2 := &models.Job{
				Type:      "increment",
				CreatedAt: time.Now(),
			}
			job2.SetInput(models.JSONDictionary{
				"value": 100,
			})
			job2.SetParent(job)
			m.RunJob(job2)
			flag = true
		}

		return errors.New("Oops")
	}

	m := jobs.ManagerSingleton
	m.RegisterWorker("increment", increment)

	job := &models.Job{
		Type:      "increment",
		CreatedAt: time.Now(),
	}
	job.SetInput(models.JSONDictionary{
		"value": 10,
	})
	m.RunJob(job)

	time.Sleep(500 * time.Millisecond)
	fmt.Println(">>> counter", counter)
}

func main() {
	database.Setup(DevDataSourceName)
	database.Manager.TruncateDatabase()
	testJobsUsage()
	time.Sleep(time.Second)

	r := gin.Default()
	r.Use(cors.Default()) // Default() allows all origins
	server.Register(r)
	r.Run(":8000")
}
