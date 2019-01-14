package models

import "time"

// Task struct
type Task struct {
	ID        int64     `json:"id"`
	UserID    string    `json:"userid"`
	Title     string    `json:"title"`
	Due       time.Time `json:"due"`
	Completed bool      `json:"completed"`
	Effort    float32   `json:"effort"`
	Notes     string    `json:"notes"`
	Tags      []string  `json:"tags"`
}
