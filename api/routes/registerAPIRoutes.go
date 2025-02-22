package routes

import (
	"net/http"

	"github.com/gorilla/mux"
	"github.com/salvizj/Redraw/api/handlers"
)

func RegisterAPIRoutes(r *mux.Router) {
	r.HandleFunc("/create-lobby", handlers.CreateLobbyHandler).Methods(http.MethodPost)
	r.HandleFunc("/join-lobby", handlers.JoinLobbyHandler).Methods(http.MethodPost)
	r.HandleFunc("/get-lobby-details", handlers.GetLobbyDetailsHandler).Methods(http.MethodGet)
	r.HandleFunc("/get-user-details", handlers.GetUserDetailsHandler).Methods(http.MethodGet)
	r.HandleFunc("/ws", handlers.WebSocketHandler).Methods(http.MethodGet)
}
