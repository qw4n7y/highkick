package db

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	_ "github.com/go-sql-driver/mysql"

	"github.com/golang-migrate/migrate/v4"
	migrateMySQL "github.com/golang-migrate/migrate/v4/database/mysql"
	_ "github.com/golang-migrate/migrate/v4/source/file"

	"gopkg.in/reform.v1"
	reformMySQL "gopkg.in/reform.v1/dialects/mysql"
)

// DB keeps everyting related to database
//
type DB struct {
	DB  *sql.DB
	DBR *reform.DB
}

func (m *DB) initDatabase(connectionString string) {
	db, _ := sql.Open("mysql", connectionString)
	m.DB = db

	if err := m.DB.Ping(); err != nil {
		panic(fmt.Sprintf("Failed to ping database: %v", err.Error()))
	}
}

func (m *DB) runMigrations() {
	driver, _ := migrateMySQL.WithInstance(m.DB, &migrateMySQL.Config{})
	migrations, _ := migrate.NewWithDatabaseInstance(
		"file://migrations",
		"mysql",
		driver,
	)
	err := migrations.Up()
	if err != nil {
		panic(fmt.Sprintf("Migration status: %v", err.Error()))
	} else {
		fmt.Println("Sidekiq: applied latest database migrations")
	}
}

func (m *DB) initReform() {
	logger := log.New(os.Stderr, "SQL: ", log.Flags())
	m.DBR = reform.NewDB(m.DB, reformMySQL.Dialect, reform.NewPrintfLogger(logger.Printf))
}

// Setup initializes database connection and runs migrations
//
func (m *DB) Setup(connectionString string) {
	m.initDatabase(connectionString)
	m.runMigrations()
	m.initReform()
}
