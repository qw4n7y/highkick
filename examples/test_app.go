package main

import (
	"fmt"
	"log"
	"sync"

	"github.com/gin-gonic/gin"
	"github.com/qw4n7y/highkick"
)

const HELLO_WORLD = "HELLO_WORLD"

func HelloWorldWorker(job *highkick.Job) error {
	fmt.Println("Hello, world !", job.ID)
	return nil
}

func init() {
	highkick.Register(HELLO_WORLD, HelloWorldWorker)
}

func main() {
	highkick.Setup("root:root@tcp(127.0.0.1:3307)/highkick?clientFoundRows=true&charset=utf8mb4&parseTime=true&multiStatements=true")
	job := highkick.NewJob(HELLO_WORLD, highkick.Input{}, nil)
	highkick.Run(job)
	fmt.Println("Run", job)

	gin.SetMode(gin.ReleaseMode)
	r := gin.Default()
	r.Static("/gui", "./gui/build")
	highkick.RegisterGuiBackendHandler(r)
	log.Fatalln(r.Run())

	wg := sync.WaitGroup{}
	wg.Add(1)
	wg.Wait()
}
