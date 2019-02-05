package repositories

import (
	"database/sql"

	"github.com/madhanganesh/taskpad/api/models"
)

// TaskMetricsRepository struct
type TaskMetricsRepository struct {
	db *sql.DB
}

// Init method
func (r *TaskMetricsRepository) Init(db *sql.DB) {
	r.db = db
}

// GetDailyTaskMetrics method
func (r *TaskMetricsRepository) GetDailyTaskMetrics(userid string, from string, to string) ([]models.TaskMetric, error) {
	query := `
    select date(due), sum(effort) from tasks
    where (due between $2 and $3)
    and userid = $1
    group by date(due)
    order by date(due)
  `

	rows, err := r.db.Query(query, userid, from, to)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	return getMetricsFromRows(rows)
}

func getMetricsFromRows(rows *sql.Rows) ([]models.TaskMetric, error) {
	taskMetrics := []models.TaskMetric{}
	for rows.Next() {
		var taskMetric models.TaskMetric
		err := rows.Scan(&taskMetric.Day, &taskMetric.Effort)
		if err != nil {
			return nil, err
		}

		taskMetrics = append(taskMetrics, taskMetric)
	}

	return taskMetrics, nil
}
