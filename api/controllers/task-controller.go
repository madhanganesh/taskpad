package controllers

import (
	"database/sql"
	"errors"
	"fmt"
	"log"
	"strconv"
	"time"

	"github.com/madhanganesh/taskpad/api/models"

	"github.com/gin-gonic/gin"

	"github.com/madhanganesh/taskpad/api/repositories"
)

var userid = "usr1"

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
	var task models.Task
	ctx.BindJSON(&task)
	if task.Title == "" {
		ctx.JSON(400, gin.H{
			"error": "title should not be empty",
		})
		return
	}
	task.UserID = userid
	if task.Tags == nil {
		task.Tags = []string{}
	}
	if task.Due.IsZero() {
		task.Due = time.Now().UTC()
	}

	createdTask, err := c.taskRepository.CreateTask(task)
	if err != nil {
		log.Printf("Error: %v\n", err)
		ctx.JSON(400, gin.H{
			"error": err.Error(),
		})
		return
	}

	ctx.JSON(201, gin.H{
		"task": createdTask,
	})
}

// GetTasks method
func (c *TaskController) GetTasks(ctx *gin.Context) {
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

// GetTaskByID method
func (c *TaskController) GetTaskByID(ctx *gin.Context) {
	idstr := ctx.Param("id")
	id, err := strconv.ParseInt(idstr, 10, 64)
	if err != nil {
		ctx.JSON(400, gin.H{
			"message": fmt.Sprintf("%s is not a valid number", idstr),
		})
		return
	}

	task, err := c.taskRepository.GetTaskByID(userid, id)
	if err != nil {
		ctx.JSON(400, gin.H{
			"message": err.Error(),
		})
		return
	}

	ctx.JSON(200, gin.H{
		"task": task,
	})
}

// UpdateTaskForID method
func (c *TaskController) UpdateTaskForID(ctx *gin.Context) {
	idstr := ctx.Param("id")
	id, err := strconv.ParseInt(idstr, 10, 64)
	if err != nil {
		ctx.JSON(400, gin.H{
			"message": fmt.Sprintf("%s is not a valid number", idstr),
		})
		return
	}

	existingTask, err := c.taskRepository.GetTaskByID(userid, id)
	if err != nil {
		ctx.JSON(400, gin.H{
			"message": err.Error(),
		})
		return
	}

	ctx.BindJSON(&existingTask)
	err = c.taskRepository.UpdateTask(userid, id, existingTask)
	if err != nil {
		ctx.JSON(400, gin.H{
			"error": err.Error(),
		})
		return
	}

	ctx.JSON(200, gin.H{
		"message": fmt.Sprintf("%d updated", id),
	})
}

// DeleteTaskForID method
func (c *TaskController) DeleteTaskForID(ctx *gin.Context) {
	idstr := ctx.Param("id")
	id, err := strconv.ParseInt(idstr, 10, 64)
	if err != nil {
		ctx.JSON(400, gin.H{
			"message": fmt.Sprintf("%s is not a valid number", idstr),
		})
		return
	}

	err = c.taskRepository.DeleteTask(userid, id)
	if err != nil {
		ctx.JSON(400, gin.H{
			"error": err.Error(),
		})
		return
	}

	ctx.JSON(200, gin.H{
		"message": fmt.Sprintf("%d deleted", id),
	})
}
