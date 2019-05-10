package database

var (
	Database DatabaseManager
)

// Setup inits singleton
func Setup(dataSourceName string) {
	Database.Setup(dataSourceName)
}
