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
const DB = "root:root@tcp(127.0.0.1:3306)/highkick_dev?clientFoundRows=true&charset=utf8mb4&parseTime=true&multiStatements=true"

func HelloWorld(job *highkick.Job) error {
	highkick.Lock(*job)
	defer highkick.Unlock(*job)

	for _, key := range []string{"Depth"} {
		if !gjson.Get(*job.Input, key).Exists() {
			return fmt.Errorf("%v is required", key)
		}
	}
	depth := gjson.Get(*job.Input, "Depth").Int()

	if depth <= 0 {
		return nil
	}

	time.Sleep(1 * time.Second)

	msg := fmt.Sprintf("I am job %v. Depth = %v", job.ID, depth)
	highkick.SetOutput(job, "msg", msg)
	highkick.Log(job, msg)
	fmt.Println(msg)

	time.Sleep(10 * time.Second)
	// highkick.RunSync(highkick.NewJob(HELLO_WORLD, highkick.Input{
	// 	"Depth": depth - 1,
	// }, job))

	return nil
}

func init() {
	inputJSONSchema := `{
		"type": "object",
		"properties": {
			"Depth": { "type": "number" },
			"Message": { "type": "string" }
		},
		"required": ["Depth", "Message"]
	}`
	highkick.Register(highkick.JobMeta{
		SID:             HELLO_WORLD,
		Title:           "Hello, world!",
		Perform:         HelloWorld,
		InputJSONSchema: &inputJSONSchema,
	})
}

func main() {
	highkick.SetupDatabase(DB, highkick.SetupDatabaseOptions{RunMigrations: false})
	highkick.RunWorkerLauncher()
	highkick.RunSchedulers()

	highkick.JobsPubSub.Subscribe(func(iMessage interface{}) {
		message := iMessage.(highkick.PubSubMessage)
		fmt.Printf("Job %v (%+v) completed with %v error\n", message.Job.Type, message.Job.GetInput(), message.Error)
	})

	gin.SetMode(gin.ReleaseMode)
	engine := gin.Default()
	engine.Use(cors.Default())

	engine.Static("/app", ".")

	highkickAuth := gin.BasicAuth(gin.Accounts{"foo": "bar"})

	highkick.RunServer(engine, highkick.RunServerParams{
		AuthMiddleware: &highkickAuth,
		ClientURL:      "/highkick_app",
	})
	go func() {
		if err := engine.Run("0.0.0.0:8000"); err != nil {
			log.Fatalln(err)
		}
	}()

	fmt.Println("Server running on http://localhost:8000/app")

	// USAGE

	// Case 1. Run in async way. Will be runned by worker launcher
	// highkick.RunAsync(highkick.NewJob(HELLO_WORLD, highkick.Input{
	// 	"Depth": 1,
	// }, nil))

	// Case 2. Run scheduler

	wg := sync.WaitGroup{}
	wg.Add(1)
	wg.Wait()
}
