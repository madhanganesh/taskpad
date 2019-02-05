package models

import "time"

// TaskMetric struct
type TaskMetric struct {
	Day    time.Time `json:"day"`
	Effort float32   `json:"effort"`
}
