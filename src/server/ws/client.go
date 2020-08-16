package ws

import (
	"github.com/gorilla/websocket"
)

type Client struct {
	Conn *websocket.Conn
	Hub  *Hub

	Read  chan Message
	Write chan Message
}

func NewClient(conn *websocket.Conn, hub *Hub) *Client {
	client := Client{
		Conn:  conn,
		Hub:   hub,
		Read:  make(chan Message),
		Write: make(chan Message, 100),
	}
	return &client
}

func (c *Client) Close() {
	c.Hub.Unregister(c)
	c.Conn.Close()
}
