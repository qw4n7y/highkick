package main

import "sidekiq/db"

func main() {
	var db db.DB
	db.Setup("root:root@tcp(127.0.0.1:3307)/sidekiq?clientFoundRows=true&charset=utf8mb4&parseTime=true&multiStatements=true")
}
