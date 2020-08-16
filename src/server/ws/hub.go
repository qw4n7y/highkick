package ws

import (
	"encoding/json"

	"github.com/google/uuid"
)

// Subscription

type Subscription struct {
	ID          string  `json:"id"`
	ChannelName string  `json:"channel"`
	client      *Client `json:"-"`
}

func NewSubscription(channelName string, client *Client) *Subscription {
	uuid, _ := uuid.NewRandom()
	subscription := Subscription{
		ID:          uuid.String(),
		ChannelName: channelName,
		client:      client,
	}
	return &subscription
}

func (s *Subscription) ToJSON() string {
	j, _ := json.Marshal(s)
	return string(j)
}

// Channel

type Channel struct {
	subscriptions PointersList
}

func NewChannel() *Channel {
	channel := Channel{
		subscriptions: NewPointersList(),
	}
	return &channel
}

// Hub

type Hub struct {
	clients  PointersList
	channels map[string]Channel
}

func NewHub() Hub {
	hub := Hub{
		clients:  NewPointersList(),
		channels: make(map[string]Channel),
	}
	return hub
}

func (hub *Hub) Register(client *Client) {
	something := Something(*client)
	hub.clients.Add(&something)
}

func (hub *Hub) Unregister(client *Client) {
	something := Something(*client)
	hub.clients.Remove(&something)
	for channelName := range hub.channels {
		hub.Unsubscribe(channelName, client)
	}
}

func (hub *Hub) Subscribe(channelName string, client *Client) *Subscription {
	_, exist := hub.channels[channelName]
	if !exist {
		hub.channels[channelName] = *NewChannel()
	}
	channel := hub.channels[channelName]
	subscription := NewSubscription(channelName, client)

	something := Something(subscription)
	channel.subscriptions.Add(&something)

	return subscription
}

func (hub *Hub) Unsubscribe(channelName string, client *Client) {
	_, exist := hub.channels[channelName]
	if !exist {
		return
	}
	// TODO
}

func (hub *Hub) BroadcastTopAll(message *Message) {
	for _, clientPtr := range hub.clients.Items() {
		client := (*clientPtr).(Client)
		client.Write <- *message
	}
}

func (hub *Hub) BroadcastToChannel(channelName string, message *Message) {
	channel, exist := hub.channels[channelName]
	if !exist {
		return
	}
	for _, subscriptionPtr := range channel.subscriptions.Items() {
		subscription := (*subscriptionPtr).(*Subscription)
		msg := Message(*message) // clone
		msg.SubscriptionID = &subscription.ID
		subscription.client.Write <- msg
	}
}
