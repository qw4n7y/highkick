package database

// Keeps singleton instance of Manager
var (
	Manager manager
)

// Setup inits singleton
func Setup(dataSourceName string) {
	Manager.Setup(dataSourceName)
}

// Close closes all connections
func Close() {
	if db := Manager.DB; db != nil {
		db.Close()
	}
}
