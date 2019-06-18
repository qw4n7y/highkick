package ws

import (
	"encoding/json"
	"fmt"
	"sync"
)

func HandleClient(client *Client) {
	defer func() {
		client.Close()
	}()

	wg := sync.WaitGroup{}

	go func() {
		defer func() {
			wg.Done()
		}()
		HandleIncommingMessages(client)
	}()
	wg.Add(1)

	// Read
	go func() {
		defer func() {
			wg.Done()
		}()
		for {
			message := Message{}
			if err := client.Conn.ReadJSON(&message); err != nil {
				fmt.Println("[WS] [Read]: ", err)
				break
			}
			client.Read <- message
		}
	}()
	wg.Add(1)

	// Write
	go func() {
		defer func() {
			wg.Done()
		}()
		for {
			select {
			case message := <-client.Write:
				if err := client.Conn.WriteJSON(message); err != nil {
					fmt.Println("[WS] [Write]: ", err)
				}
				// Let this be blocking (not to consume CPU)
				// Having default case makes it UNblocking
				// default:
			}
		}
	}()
	wg.Add(1)

	wg.Wait()
}

func HandleIncommingMessages(client *Client) {
	for {
		select {
		case message := <-client.Read:
			switch message.Type {
			case "ping":
				answer := Message{
					Type:    "pong",
					Payload: nil,
					ID:      message.ID,
				}
				client.Write <- answer
			case "subscribe":
				type subscribePayload struct {
					Channel string `json:"channel"`
				}
				payload := subscribePayload{}
				json.Unmarshal(message.Payload, &payload)
				subscription := client.Hub.Subscribe(payload.Channel, client)
				answer := Message{
					Type:           "subscribed",
					Payload:        json.RawMessage(fmt.Sprintf(`{"subscription": %v}`, subscription.ToJSON())),
					ID:             message.ID,
					SubscriptionID: &subscription.ID,
				}
				client.Write <- answer
			default:
				fmt.Println("[WS] [Read] Not known message type: ", message.Type)
			}
			// Let this be blocking (not to consume CPU)
			// Having default case makes it UNblocking
			// default:
		}
	}
}
