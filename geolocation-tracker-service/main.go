package main

import (
	"encoding/json"
	"fmt"
	"github.com/gorilla/websocket"
	"log"
	"net/http"
)

type EventHandlerType func(conn *websocket.Conn, data interface{}) error

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return r.Header.Get("Origin") == "http://localhost:5173" // Allow connections from any origin (update as needed)
	},
}

func handlePing(conn *websocket.Conn, data interface{}) error {
	return conn.WriteJSON(Message{Event: "pong", Data: "ping pong response from go websocket"})
}

var eventHandlers = map[string]EventHandlerType{
	"ping": handlePing,
}

type Message struct {
	Event string      `json:"event"`
	Data  interface{} `json:"data"`
}

func handleWebSocket(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("error upgrating connection", err)
		return
	}
	defer conn.Close()

	log.Println("Client connected")
	for {
		var msg Message
		err := conn.ReadJSON(&msg)
		if err != nil {
			log.Println("Error reading JSON:", err)
			break
		}

		log.Printf("Received event: %s with data: %v", msg.Event, msg.Data)

		if handler, exists := eventHandlers[msg.Event]; exists {
			err = handler(conn, msg.Data)
		} else {
			log.Println("Unknown event:", msg.Event)
		}

		if err != nil {
			log.Println("Error handling event:", err)
			break
		}
	}
}
func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173") // Replace with your frontend URL
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		// Handle preflight requests
		if r.Method == http.MethodOptions {
			return
		}

		// Call the next handler
		next.ServeHTTP(w, r)
	})
}

type ResponseData struct {
	Message string      `json:"message"`
	Data    interface{} `json:"data"` // Can hold any data
}

func handleRootRequest(w http.ResponseWriter, r *http.Request) {
	data := ResponseData{Message: "success", Data: map[string]string{"key": "value"}}
	w.Header().Set("Content-Type", "application/json")
	jsonResponse, err := json.Marshal(data)
	if err != nil {
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}
	w.Write(jsonResponse)
}
func main() {
	http.HandleFunc("/", handleRootRequest)
	http.HandleFunc("/socket", handleWebSocket)
	handler := corsMiddleware(http.DefaultServeMux)
	fmt.Println("starting server on port 8080...")
	http.ListenAndServe(":8080", handler)
}
