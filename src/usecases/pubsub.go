package usecases

import (
	"encoding/json"
	"fmt"
	"log"

	"github.com/qw4n7y/gopubsub"
	"github.com/qw4n7y/highkick/src/models"
	jobsRepo "github.com/qw4n7y/highkick/src/repo/jobs"
	"github.com/qw4n7y/highkick/src/server/ws"
)

var JobsPubSub *gopubsub.Hub

func init() {
	JobsPubSub = gopubsub.NewHub()
}

func BroadcastJobUpdate(job *models.Job, err error) {
	BroadcastJobUpdateViaWS(job)
	pubSubMessage := models.PubSubMessage{
		Job:   *job,
		Error: err,
	}
	JobsPubSub.Publish(pubSubMessage)
}

func BroadcastJobUpdateViaWS(job *models.Job) {
	root, err := jobsRepo.GetOne(job.GetRootID())
	if err != nil {
		log.Fatal(err)
	}

	treeStatus, err := GetJobTreeStatus(*root)
	if err != nil {
		log.Fatal(err)
	}

	root.TreeStatus = treeStatus

	rootJobJSON, _ := json.Marshal(root)
	message := ws.Message{
		Type:    "update",
		Payload: json.RawMessage(fmt.Sprintf(`{"job": %v}`, string(rootJobJSON))),
	}
	ws.TheHub.BroadcastToChannel("jobs", &message)
}
