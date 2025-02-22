package db

import (
	"database/sql"
	"fmt"
	"os"

	"github.com/joho/godotenv"
	_ "github.com/tursodatabase/libsql-client-go/libsql"
)

var DB *sql.DB

func Initialize() {
	if err := godotenv.Load(); err != nil {
		fmt.Fprintf(os.Stderr, "Error loading .env file: %v", err)
		os.Exit(1)
	}

	url := os.Getenv("TURSO_DATABASE_URL")
	token := os.Getenv("TURSO_AUTH_TOKEN")

	if url == "" || token == "" {
		fmt.Fprintf(os.Stderr, "TURSO_DATABASE_URL and TURSO_AUTH_TOKEN must be set")
		os.Exit(1)
	}

	connURL := fmt.Sprintf("%s?authToken=%s", url, token)

	var err error
	DB, err = sql.Open("libsql", connURL)
	if err != nil {
		fmt.Fprintf(os.Stderr, "failed to open db %s: %s", connURL, err)
		os.Exit(1)
	}
}
