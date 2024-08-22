package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"sort"
	"sync"
	"time"

	"strconv"
	"strings"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
    ReadBufferSize:  1024,
    WriteBufferSize: 1024,
}

type Score struct {
    Name  string `json:"name"`
    Rank  int    `json:"rank"`
    Score int    `json:"score"`
    Time  string `json:"time"`
	Percentile float64 `json:"percentile"`
}

var (
    scores []Score
    mutex  sync.Mutex
    clients = make(map[*websocket.Conn]bool) // connected clients
)

func handleConnections(w http.ResponseWriter, r *http.Request) {
    upgrader.CheckOrigin = func(r *http.Request) bool { return true }
    ws, err := upgrader.Upgrade(w, r, nil)
    if err != nil {
        log.Fatal(err)
    }
    defer ws.Close()

    clients[ws] = true

    for {
        var newScore Score
        err := ws.ReadJSON(&newScore)
        if err != nil {
            log.Printf("error: %v", err)
            delete(clients, ws)
            break
        }
        mutex.Lock()
        scores = append(scores, newScore)
		timeI, errI := parseGameTime(newScore.Time)
		fmt.Println(timeI)
		if(errI != nil){
			fmt.Println(errI)
		}
		sort.Slice(scores, func(i, j int) bool {
			if scores[i].Score == scores[j].Score {
				timeI, _ := parseGameTime(scores[i].Time)
				timeJ, _ := parseGameTime(scores[j].Time)
				return timeI < timeJ // Sort by time if scores are equal
			}
			return scores[i].Score > scores[j].Score // Default to sorting by score
		})

		// Assign percentiles
		for index, score := range scores {
			// Calculate percentile
			score.Percentile = float64(len(scores)-index-1) / float64(len(scores)) * 100
			scores[index] = score // Update the slice with the new percentile
		}
	
        mutex.Unlock()

        broadcastScores()
    }
}

func broadcastScores() {
	fmt.Println("hello")
    mutex.Lock()
    defer mutex.Unlock()
    for client := range clients {
        err := client.WriteJSON(scores)
        if err != nil {
            log.Printf("error: %v", err)
            client.Close()
            delete(clients, client)
        }
    }
}

func main() {
    http.HandleFunc("/ws", handleConnections)
    http.Handle("/scores", enableCORS(http.HandlerFunc(handleScores)))
    log.Fatal(http.ListenAndServe(":8080", nil))
}


func parseGameTime(timeStr string) (time.Duration, error) {
    // Assuming timeStr is in the format "Time: MM:SS"
    trimmed := strings.TrimPrefix(timeStr, "Time: ") // Remove the prefix
    parts := strings.Split(trimmed, ":") // Split into minutes and seconds
    if len(parts) != 2 {
        return 0, fmt.Errorf("invalid time format")
    }
    // Assume parts are "MM" and "SS"
    minutes, err := strconv.Atoi(parts[0])
    if err != nil {
        return 0, err
    }
    seconds, err := strconv.Atoi(parts[1])
    if err != nil {
        return 0, err
    }
    // Convert to duration
    return time.Duration(minutes)*time.Minute + time.Duration(seconds)*time.Second, nil
}


func handleScores(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case "GET":
		mutex.Lock()
		defer mutex.Unlock()
		json.NewEncoder(w).Encode(scores)
	case "POST":
		var score Score
		if err := json.NewDecoder(r.Body).Decode(&score); err != nil {
			http.Error(w, "Invalid score data", http.StatusBadRequest)
			return
		}
		addScore(score)
		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(score)
	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}


func addScore(newScore Score) {
	mutex.Lock()
	scores = append(scores, newScore)
	sortScores()

	mutex.Unlock()
}

func sortScores() {
	sort.Slice(scores, func(i, j int) bool {
		if scores[i].Score == scores[j].Score {
			timeI, _ := parseGameTime(scores[i].Time)
			timeJ, _ := parseGameTime(scores[j].Time)
			return timeI < timeJ // Sort by time if scores are equal
		}
		return scores[i].Score > scores[j].Score // Default to sorting by score
	})
}

func enableCORS(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        // Set CORS headers
        w.Header().Set("Access-Control-Allow-Origin", "*") // This is very permissive
        w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

        // Handle preflight requests
        if r.Method == "OPTIONS" {
            w.WriteHeader(http.StatusOK)
            return
        }

        next.ServeHTTP(w, r)
    })
}
