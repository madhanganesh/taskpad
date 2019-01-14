package controllers

import (
	"database/sql"
	"errors"
	"log"
	"time"

	"github.com/madhanganesh/taskpad/api/models"

	"github.com/gin-gonic/gin"

	"github.com/madhanganesh/taskpad/api/repositories"
)

// TaskController struct
type TaskController struct {
	taskRepository *repositories.TaskRepository
}

// Init method
func (c *TaskController) Init(db *sql.DB) {
	c.taskRepository = &repositories.TaskRepository{}
	c.taskRepository.Init(db)
}

// CreateTask method
func (c *TaskController) CreateTask(ctx *gin.Context) {
	userid := "usr1"

	var task models.Task
	ctx.BindJSON(&task)
	task.UserID = userid
	if task.Tags == nil {
		task.Tags = []string{}
	}
	if task.Due.IsZero() {
		task.Due = time.Now().UTC()
	}

	createTask, err := c.taskRepository.CreateTask(task)
	if err != nil {
		log.Printf("Error: %v\n", err)
		ctx.JSON(400, gin.H{
			"error": err.Error(),
		})
		return
	}

	ctx.JSON(201, gin.H{
		"task": createTask,
	})
}

// GetTasks method
func (c *TaskController) GetTasks(ctx *gin.Context) {
	userid := "usr1"

	tasks := []models.Task{}
	var err error
	query := ctx.Request.URL.Query()
	pendings := query["pending"]
	froms := query["from"]
	tos := query["to"]
	if len(pendings) > 0 {
		log.Printf("invoking GetPendingTasks for user %s\n", userid)
		tasks, err = c.taskRepository.GetPendingTasks(userid)
	} else if len(froms) > 0 && len(tos) > 0 {
		from := froms[0]
		to := tos[0]
		log.Printf("invoking GetTasksByDateRange for user=%s with from=%s, to=%s\n", userid, from, to)
		tasks, err = c.taskRepository.GetTasksByDateRange(userid, from, to)
	} else {
		err = errors.New("Invalid query parameters. Either peding or from/to should be provided")
	}

	if err != nil {
		ctx.JSON(400, gin.H{
			"message": err.Error(),
		})
		return
	}

	ctx.JSON(200, gin.H{
		"tasks": tasks,
	})
}
