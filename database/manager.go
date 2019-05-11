package database

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	sqlDriverMySQL "github.com/go-sql-driver/mysql"

	"github.com/golang-migrate/migrate/v4"
	migrateMySQL "github.com/golang-migrate/migrate/v4/database/mysql"
	_ "github.com/golang-migrate/migrate/v4/source/file"

	"gopkg.in/reform.v1"
	reformMySQL "gopkg.in/reform.v1/dialects/mysql"
)

const migrateMigrationsTableName = "schema_migrations"

// manager keeps everyting related to database
type manager struct {
	databaseName string
	DB           *sql.DB
	DBR          *reform.DB
}

func (m *manager) initDatabase(dataSourceName string) {
	db, _ := sql.Open("mysql", dataSourceName)
	m.DB = db

	config, _ := sqlDriverMySQL.ParseDSN(dataSourceName)
	m.databaseName = config.DBName

	if err := m.DB.Ping(); err != nil {
		panic(fmt.Sprintf("Failed to ping database: %v", err.Error()))
	}
}

func (m *manager) runMigrations() {
	driver, _ := migrateMySQL.WithInstance(m.DB, &migrateMySQL.Config{})
	migrations, _ := migrate.NewWithDatabaseInstance(
		"file://migrations",
		"mysql",
		driver,
	)
	err := migrations.Up()
	if err != nil {
		log.Printf("Migration status: %v\n", err.Error())
	} else {
		log.Println("highkick: applied latest database migrations")
	}
}

func (m *manager) initReform() {
	logger := log.New(os.Stderr, "SQL: ", log.Flags())
	m.DBR = reform.NewDB(m.DB, reformMySQL.Dialect, reform.NewPrintfLogger(logger.Printf))
}

// Setup initializes database connection and runs migrations
//
func (m *manager) Setup(dataSourceName string) {
	m.initDatabase(dataSourceName)
	m.runMigrations()
	m.initReform()
}

// TruncateDatabase truncates the database (using in tests)
func (m *manager) TruncateDatabase() {
	sql := fmt.Sprintf("SELECT TABLE_NAME FROM information_schema.tables WHERE table_schema = ?")
	rows, err := m.DB.Query(sql, m.databaseName)
	if err != nil {
		log.Panic(err)
	}
	defer rows.Close()

	for rows.Next() {
		var tableName string
		if err := rows.Scan(&tableName); err != nil {
			log.Panic(err)
		}
		if tableName == migrateMigrationsTableName {
			continue
		}
		sql := fmt.Sprintf("TRUNCATE TABLE %s", tableName)
		log.Println(sql)
		if _, err := m.DB.Exec(sql); err != nil {
			log.Panic(err)
		}
	}

	if err := rows.Err(); err != nil {
		log.Fatal(err)
	}
}
