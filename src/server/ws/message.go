package ws

import "encoding/json"

type Message struct {
	Type           string          `json:"type"`
	Payload        json.RawMessage `json:"payload"`
	ID             *string         `json:"id"`
	SubscriptionID *string         `json:"subscriptionId"`
}
