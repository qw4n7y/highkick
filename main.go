package main

import (
	"fmt"
	"sidekiq/database"
	"sidekiq/repository"
)

func init() {
	database.Setup("root:root@tcp(127.0.0.1:3307)/sidekiq?clientFoundRows=true&charset=utf8mb4&parseTime=true&multiStatements=true")
}

func main() {
	jobs := repository.GetJobs("")
	fmt.Println(jobs)
}
