package main

import (
	"fmt"
	"log"
	"sync"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/qw4n7y/highkick"

	"github.com/tidwall/gjson"
)

const HELLO_WORLD = "HELLO_WORLD"

func HelloWorldWorker(job *highkick.Job) error {
	for _, key := range []string{"depth"} {
		if !gjson.Get(*job.Input, key).Exists() {
			return fmt.Errorf("%v is required", key)
		}
	}
	depth := gjson.Get(*job.Input, "depth").Int()

	if depth <= 0 {
		return nil
	}

	time.Sleep(1 * time.Second)

	msg := fmt.Sprintf("I am job %v. Depth = %v", job.ID, depth)
	highkick.SetOutput(job, "msg", msg)
	highkick.Log(job, msg)
	fmt.Println(msg)

	highkick.Run(highkick.NewJob(HELLO_WORLD, highkick.Input{
		"depth": depth - 1,
	}, job))

	return nil
}

func init() {
	highkick.Register(HELLO_WORLD, HelloWorldWorker)
}

func main() {
	dsn := highkick.DevDatabaseDSN // "root:root@tcp(127.0.0.1:3307)/highkick?clientFoundRows=true&charset=utf8mb4&parseTime=true&multiStatements=true"
	highkick.Setup(dsn, highkick.SetupOptions{RunMigrations: true})

	highkick.JobsPubSub.Subscribe(func(iMessage interface{}) {
		message := iMessage.(highkick.PubSubMessage)
		fmt.Printf("Job %v (%+v) completed with %v error\n", message.Job.Type, message.Job.GetInput(), message.Error)
	})

	// go func() {
	// 	for {
	// 		job := highkick.NewJob(HELLO_WORLD, highkick.Input{}, nil)

	// 		fmt.Println("[JOB] Run in goroutine", job)
	// 		highkick.Run(job)

	// 		time.Sleep(5 * time.Second)
	// 	}
	// }()

	go func() {
		highkick.Run(highkick.NewJob(HELLO_WORLD, highkick.Input{
			"depth": 5,
		}, nil))
		return

		// highkick.Run(highkick.NewPeriodicalJob(HELLO_WORLD, highkick.Input{
		// 	"depth": 5,
		// }, "0 * * * * *"))
		// return

		// for i := 0; i < 20; i++ {
		// 	job := highkick.NewJob(HELLO_WORLD, highkick.Input{
		// 		"i": i,
		// 	}, nil)

		// 	fmt.Println("[JOB] Run coherently", job)
		// 	highkick.RunJobCoherently(job)
		// 	msg := highkick.GetOutput(job, "msg")
		// 	fmt.Println("[JOB] Output", *msg)

		// 	time.Sleep(5 * time.Second)
		// }
	}()

	gin.SetMode(gin.ReleaseMode)
	engine := gin.Default()
	engine.Use(cors.Default())
	engine.Static("/app", ".")
	highkick.SetupServer(engine)
	log.Fatalln(engine.Run())

	wg := sync.WaitGroup{}
	wg.Add(1)
	wg.Wait()
}
