package main

import (
	"fmt"
	"log"
	"sync"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/qw4n7y/highkick"
)

const HELLO_WORLD = "HELLO_WORLD"

func HelloWorldWorker(job *highkick.Job) error {
	fmt.Println("Hello, world !", job.ID)
	time.Sleep(5 * time.Second)
	return nil
}

func init() {
	highkick.Register(HELLO_WORLD, HelloWorldWorker)
}

func main() {
	dsn := highkick.TestDataSourceName // "root:root@tcp(127.0.0.1:3307)/highkick?clientFoundRows=true&charset=utf8mb4&parseTime=true&multiStatements=true"
	highkick.Setup(dsn)

	highkick.JobsPubSub.Subscribe(func(iMessage interface{}) {
		message := iMessage.(highkick.PubSubMessage)
		fmt.Printf("Job %v completed with %v error\n", message.Job.Type, message.Error)
	})

	go func() {
		for {
			job := highkick.NewJob(HELLO_WORLD, highkick.Input{}, nil)
			highkick.Run(job)
			fmt.Println("[JOB] Run", job)
			time.Sleep(5 * time.Second)
		}
	}()

	gin.SetMode(gin.ReleaseMode)
	r := gin.Default()
	r.Use(cors.Default())
	r.Static("/app", "./examples")
	highkick.RegisterGuiBackendHandler(r)
	log.Fatalln(r.Run())

	wg := sync.WaitGroup{}
	wg.Add(1)
	wg.Wait()
}
