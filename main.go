package main

import (
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"

	"github.com/madhanganesh/taskpad/api/controllers"
	"github.com/madhanganesh/taskpad/api/util"
)

func main() {
	//gin.SetMode(gin.ReleaseMode)
	router := gin.Default()
	db, err := util.GetDB()
	if err != nil {
		log.Panic(err)
	}
	defer db.Close()

	taskController := controllers.TaskController{}
	taskController.Init(db)

	router.Use(func(ctx *gin.Context) {
		if !util.Contains([]string{"POST", "PUT", "PATCH"}, ctx.Request.Method) {
			return
		}

		if ctx.Request.Header["Content-Length"][0] == "0" {
			ctx.JSON(http.StatusBadRequest, gin.H{"message": "Payload should not be empty"})
			ctx.AbortWithStatus(http.StatusBadRequest)
			return
		}

		if len(ctx.Request.Header["Content-Type"]) == 0 ||
			!util.Contains(ctx.Request.Header["Content-Type"], "application/json") {
			ctx.JSON(http.StatusUnsupportedMediaType, gin.H{"message": "Content type should be application/json"})
			ctx.AbortWithStatus(http.StatusUnsupportedMediaType)
			return
		}
	})

	router.POST("/api/tasks", taskController.CreateTask)
	router.GET("/api/tasks", taskController.GetTasks)
	router.GET("/api/tasks/:id", taskController.GetTaskByID)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
		log.Printf("Defaulting to port %s", port)
	}
	router.Run(":" + port)
}
