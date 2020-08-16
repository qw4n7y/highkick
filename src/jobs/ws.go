package jobs

import (
	"encoding/json"
	"fmt"

	"github.com/qw4n7y/highkick/src/models"
	"github.com/qw4n7y/highkick/src/repo"
	"github.com/qw4n7y/highkick/src/server/ws"
)

func BroadcastJobUpdateViaWS(job *models.Job) {
	root := repo.GetRootJob(job)

	treeStatus := repo.GetJobTreeStatus(root)
	root.TreeStatus = &treeStatus

	rootJobJSON, _ := json.Marshal(root)
	message := ws.Message{
		Type:    "update",
		Payload: json.RawMessage(fmt.Sprintf(`{"job": %v}`, string(rootJobJSON))),
	}
	ws.TheHub.BroadcastToChannel("jobs", &message)
}
