package repositories

import (
	"database/sql"
	"fmt"
	"strings"

	"github.com/madhanganesh/taskpad/api/models"
)

// TaskRepository struct
type TaskRepository struct {
	db *sql.DB
}

// Init method
func (repo *TaskRepository) Init(db *sql.DB) {
	repo.db = db
}

// CreateTask method
func (repo *TaskRepository) CreateTask(task models.Task) (models.Task, error) {
	tags := strings.Join(task.Tags, ";")
	statement := `
    insert into tasks (userid, title, due, completed, effort, tags, notes)
    values ($1, $2, $3, $4, $5, $6, $7)
    returning id
  `
	var id int64
	err := repo.db.QueryRow(statement, task.UserID, task.Title, task.Due, task.Completed, task.Effort, tags, task.Notes).Scan(&id)
	if err != nil {
		return task, err
	}
	createdTask := task
	createdTask.ID = id
	return createdTask, nil
}

// GetPendingTasks method
func (repo *TaskRepository) GetPendingTasks(userid string) ([]models.Task, error) {
	query := `
    select id, userid, title, due, completed, effort, tags, notes
    from tasks
    where userid = $1 and completed = $2
  `
	rows, err := repo.db.Query(query, userid, false)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	return getTasksFromRows(rows)
}

// GetTasksByDateRange method
func (repo *TaskRepository) GetTasksByDateRange(userid string, from string, to string) ([]models.Task, error) {
	query := `
    select id, userid, title, due, completed, effort, tags, notes
    from tasks
    where userid = $1 and (due > $2 and due < $3)
  `
	rows, err := repo.db.Query(query, userid, from, to)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	return getTasksFromRows(rows)
}

// GetTaskByID method
func (repo *TaskRepository) GetTaskByID(userid string, id int64) (models.Task, error) {
	query := `
    select id, userid, title, due, completed, effort, tags, notes
    from tasks
    where userid = $1 and id = $2
  `
	row := repo.db.QueryRow(query, userid, id)
	var tags string
	var task models.Task
	err := row.Scan(&task.ID, &task.UserID, &task.Title, &task.Due, &task.Completed, &task.Effort, &tags, &task.Notes)
	if err != nil {
		return models.Task{}, err
	}

	task.Tags = []string{}
	if len(tags) > 0 {
		task.Tags = strings.Split(tags, ";")
	}
	return task, nil
}

// UpdateTask method
func (repo *TaskRepository) UpdateTask(userid string, id int64, task models.Task) error {
	query := `
    update tasks
    set title=$3, due=$4, completed=$5, effort=$6, tags=$7, notes=$8
    where userid=$1 and id=$2
  `

	tags := strings.Join(task.Tags, ";")
	res, err := repo.db.Exec(query, userid, id, task.Title, task.Due, task.Completed, task.Effort, tags, task.Notes)
	if err != nil {
		return err
	}

	count, err := res.RowsAffected()
	if err != nil {
		return err
	}
	if count != 1 {
		return fmt.Errorf("more than 1 record got updated for %d", id)
	}

	return nil
}

// DeleteTask method
func (repo *TaskRepository) DeleteTask(userid string, id int64) error {
	query := `delete from tasks where userid=$1 and id=$2`
	res, err := repo.db.Exec(query, userid, id)
	if err != nil {
		return err
	}

	count, err := res.RowsAffected()
	if err != nil {
		return err
	}
	if count != 1 {
		return fmt.Errorf("exactly 1 row is not impacted for %d", id)
	}

	return nil
}

func getTasksFromRows(rows *sql.Rows) ([]models.Task, error) {
	tasks := []models.Task{}
	for rows.Next() {
		var task models.Task
		var tags string
		err := rows.Scan(&task.ID, &task.UserID, &task.Title, &task.Due, &task.Completed, &task.Effort, &tags, &task.Notes)
		if err != nil {
			return nil, err
		}

		task.Tags = []string{}
		if len(tags) > 0 {
			task.Tags = strings.Split(tags, ";")
		}
		tasks = append(tasks, task)
	}

	return tasks, nil
}
