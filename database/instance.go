package database

// Keeps singleton instance of Manager
var (
	Manager manager
)

type SetupOptions struct {
	RunMigrations bool
}

// Setup inits singleton
func Setup(dataSourceName string, options SetupOptions) {
	Manager.Setup(dataSourceName, options)
}

// Close closes all connections
func Close() {
	if db := Manager.DB; db != nil {
		db.Close()
	}
}
