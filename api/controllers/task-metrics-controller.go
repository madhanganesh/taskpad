package controllers

import (
	"database/sql"
	"log"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/madhanganesh/taskpad/api/models"
	"github.com/madhanganesh/taskpad/api/repositories"
)

// TaskMetricsController struct
type TaskMetricsController struct {
	taskMetricsRepository *repositories.TaskMetricsRepository
}

// Init method
func (c *TaskMetricsController) Init(db *sql.DB) {
	c.taskMetricsRepository = &repositories.TaskMetricsRepository{}
	c.taskMetricsRepository.Init(db)
}

// GetTaskMetrics method
func (c *TaskMetricsController) GetTaskMetrics(ctx *gin.Context) {
	useridi, exists := ctx.Get("userid")
	if !exists {
		ctx.JSON(400, gin.H{
			"error": "userid not found in request context",
		})
		return
	}

	query := ctx.Request.URL.Query()
	froms := query["from"]
	tos := query["to"]
	if len(froms) < 0 || len(tos) < 0 {
		errorMessage := "Invalid query parameters. From and to query parameters are missing"
		log.Println(errorMessage)
		ctx.JSON(400, gin.H{
			"message": errorMessage,
		})
		return
	}
	from := froms[0]
	to := tos[0]

	userid := useridi.(string)
	metrics, err := c.taskMetricsRepository.GetDailyTaskMetrics(userid, from, to)
	if err != nil {
		log.Printf("Error in getting task metrics for from:%s, to%s : %+v\n", from, to, err)
		ctx.JSON(400, gin.H{
			"message": err.Error(),
		})
		return
	}

	metricsAdjusted := []models.TaskMetric{}
	startDate, _ := time.Parse(time.RFC3339Nano, from)
	endDate, _ := time.Parse(time.RFC3339Nano, to)

	for timestamp := startDate; timestamp.Before(endDate); timestamp = timestamp.AddDate(0, 0, 1) {
		metricAdjusted := models.TaskMetric{}
		metricAdjusted.Day = timestamp
		metricAdjusted.Effort = 0
		for _, metric := range metrics {
			if metric.Day.Equal(timestamp) {
				metricAdjusted.Effort = metric.Effort
				break
			}
		}
		metricsAdjusted = append(metricsAdjusted, metricAdjusted)
	}

	ctx.JSON(200, gin.H{
		"metrics": metricsAdjusted,
	})
}
