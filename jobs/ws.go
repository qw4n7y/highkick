package jobs

import (
	"encoding/json"
	"fmt"

	"github.com/qw4n7y/highkick/models"
	"github.com/qw4n7y/highkick/repository"
	"github.com/qw4n7y/highkick/server/ws"
)

func NotifyAllThatJobWasUpdated(job *models.Job) {
	root := repository.GetRootJob(job)

	treeStatus := repository.GetJobTreeStatus(root)
	root.TreeStatus = &treeStatus

	rootJobJSON, _ := json.Marshal(root)
	message := ws.Message{
		Type:    "update",
		Payload: json.RawMessage(fmt.Sprintf(`{"job": %v}`, string(rootJobJSON))),
	}
	ws.TheHub.BroadcastToChannel("jobs", &message)
}
