package models

type PubSubMessage struct {
	Job   Job
	Error error
}
