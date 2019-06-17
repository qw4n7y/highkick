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
	treeStatus := repository.GetJobTreeStatus(job)
	root.TreeStatus = &treeStatus

	jobJSON, _ := json.Marshal(job)
	message := ws.Message{
		Type:    "update",
		Payload: json.RawMessage(fmt.Sprintf(`{"job": %v}`, string(jobJSON))),
	}
	ws.TheHub.BroadcastToChannel("jobs", &message)
}
