package database

import (
	"database/sql"
	"fmt"
	"io/ioutil"
	"log"

	"github.com/golang-migrate/migrate/v4"
	"github.com/golang-migrate/migrate/v4/database"
	migrateMySQL "github.com/golang-migrate/migrate/v4/database/mysql"
	migrateSQLite3 "github.com/golang-migrate/migrate/v4/database/sqlite3"
	"github.com/markbates/pkger"

	_ "github.com/golang-migrate/migrate/v4/source/file"
	_ "github.com/golang-migrate/migrate/v4/source/github"

	"gopkg.in/reform.v1"
	reformMySQL "gopkg.in/reform.v1/dialects/mysql"
)

// manager keeps everyting related to database
type manager struct {
	databaseName string
	DB           *sql.DB
	DBR          *reform.DB
}

func (m *manager) initDatabase(options DatabaseOptions) {
	m.DB = options.DB
	m.databaseName = options.Database

	if err := m.DB.Ping(); err != nil {
		panic(fmt.Sprintf("Failed to ping database: %v", err.Error()))
	}
}

func (m *manager) runMigrations(options DatabaseOptions) {
	var driver database.Driver
	{
		switch options.Engine {
		case DatabaseEngines.MySQL:
			{
				_driver, err := migrateMySQL.WithInstance(m.DB, &migrateMySQL.Config{
					MigrationsTable: "highkick_schema_migrations",
					DatabaseName:    options.Database,
				})
				if err != nil {
					panic(err.Error())
				}
				driver = _driver
			}
		case DatabaseEngines.SQLite3:
			{
				_driver, err := migrateSQLite3.WithInstance(m.DB, &migrateSQLite3.Config{
					MigrationsTable: "highkick_schema_migrations",
					DatabaseName:    options.Database,
				})
				if err != nil {
					panic(err.Error())
				}
				driver = _driver
			}
		}
	}

	migrationsDirPath := ""
	{
		file, err := pkger.Open("/client/build/index.html")
		if err != nil {
			panic(err)
		}
		migrationsDirPath = fmt.Sprintf("%v/migrations/%v", file.Info().Module.Dir, options.Engine)
	}

	migrations, err := migrate.NewWithDatabaseInstance(
		// "file://../migrations",
		// fmt.Sprintf("github://:@qw4n7y/highkick/migrations/%v", options.Engine),
		fmt.Sprintf("file://%v", migrationsDirPath),
		string(options.Engine),
		driver,
	)
	if err != nil {
		panic(err.Error())
	}

	if err := migrations.Up(); err != nil {
		log.Printf("Migration status: %v\n", err.Error())
	} else {
		log.Println("highkick: applied latest database migrations")
	}
}

func (m *manager) initReform() {
	logger := log.New(ioutil.Discard, "SQL: ", log.Flags()) // /dev/null
	//logger := log.New(os.Stderr, "SQL: ", log.Flags())
	reformLogger := reform.NewPrintfLogger(logger.Printf)
	m.DBR = reform.NewDB(m.DB, reformMySQL.Dialect, reformLogger)
}

// Setup initializes database connection and runs migrations
//
func (m *manager) Setup(options DatabaseOptions) {
	m.initDatabase(options)
	if options.RunMigrations != false {
		m.runMigrations(options)
	}
	m.initReform()
}

// TruncateDatabase truncates the database (using in tests)
func (m *manager) TruncateDatabase() {
	const tableToIgnore = "schema_migrations"

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
		if tableName == tableToIgnore {
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
