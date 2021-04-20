package main

import (
	"fmt"
	"log"
	"sync"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/contrib/static"
	"github.com/gin-gonic/gin"
	"github.com/qw4n7y/highkick"
	"github.com/tidwall/gjson"
)

const HELLO_WORLD = "HELLO_WORLD"
const DB = "root:root@tcp(127.0.0.1:3306)/highkick_dev?clientFoundRows=true&charset=utf8mb4&parseTime=true&multiStatements=true"

func HelloWorld(job *highkick.Job) error {
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

	highkick.RunSync(highkick.NewJob(HELLO_WORLD, highkick.Input{
		"Depth": depth - 1,
	}, job))

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
	highkick.SetupDatabase(DB, highkick.SetupDatabaseOptions{RunMigrations: true})
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
	engine.Use(static.Serve("/highkick/client", static.LocalFile("../client/build", true)))

	highkick.RunServer(engine, highkick.RunServerParams{
		BasicAuthUser: "root",
		BasicAuthPassword: "root",
	})
	log.Fatalln(engine.Run())

	// USAGE

	// Case 1. Run in async way. Will be runned by worker launcher
	highkick.RunAsync(highkick.NewJob(HELLO_WORLD, highkick.Input{
		"Depth": 1,
	}, nil))

	// Case 2. Run scheduler

	wg := sync.WaitGroup{}
	wg.Add(1)
	wg.Wait()
}
