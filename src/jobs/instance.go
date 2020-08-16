package jobs

// ManagerSingleton is a singleton instance of Manager
var ManagerSingleton *Manager

func init() {
	ManagerSingleton = NewManager()
}
