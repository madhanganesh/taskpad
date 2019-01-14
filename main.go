package main

import (
	"log"
	"os"

	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"

	"github.com/madhanganesh/taskpad/api/controllers"
	utils "github.com/madhanganesh/taskpad/api/utils"
)

func main() {
	gin.SetMode(gin.ReleaseMode)
	router := gin.Default()
	db, err := utils.GetDB()
	if err != nil {
		log.Panic(err)
	}
	defer db.Close()

	taskController := controllers.TaskController{}
	taskController.Init(db)

	router.POST("/api/tasks", taskController.CreateTask)
	router.GET("/api/tasks", taskController.GetTasks)

	port := os.Getenv("PORT")
	if port == "" {
		port = ":8080"
		log.Printf("Defaulting to port %s", port)
	}
	router.Run(port)
}
