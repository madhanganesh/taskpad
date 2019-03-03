package controllers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/madhanganesh/taskpad/api/models"
	"github.com/madhanganesh/taskpad/api/repositories"
)

// ReportController struct
type ReportController struct {
	reportRepository *repositories.ReportRepository
}

// Init method
func (r *ReportController) Init(db *sql.DB) {
	r.reportRepository = &repositories.ReportRepository{}
	r.reportRepository.Init(db)
}

// GetReports method
func (r *ReportController) GetReports(ctx *gin.Context) {
	useridi, exists := ctx.Get("userid")
	if !exists {
		ctx.JSON(400, gin.H{
			"error": "userid not found in request context",
		})
		return
	}
	userid := useridi.(string)

	reports, err := r.reportRepository.GetReports(userid)
	if err != nil {
		log.Printf("Error in retrieving the reports %+v\n", err)
		ctx.JSON(400, gin.H{
			"error": err.Error(),
		})
	}

	ctx.JSON(200, reports)
}

// CreateReport method
func (r *ReportController) CreateReport(ctx *gin.Context) {
	var report models.Report
	decoder := json.NewDecoder(ctx.Request.Body)
	defer ctx.Request.Body.Close()
	err := decoder.Decode(&report)
	if err != nil {
		log.Printf("Error in decoding the request body: %+v\n", err)
		ctx.JSON(400, gin.H{
			"message": err.Error(),
		})
		return
	}
	log.Printf("Received creation of report: %+v\n", report)

	if report.Title == "" {
		log.Printf("Report title is invalid with value %s\n", report.Title)
		ctx.JSON(400, gin.H{
			"error": "report title should not be empty",
		})
		return
	}

	if report.Type != "pie" && report.Type != "line" {
		log.Printf("Report type is invalid with value %s\n", report.Title)
		ctx.JSON(400, gin.H{
			"error": "Invalid report type. Only pie/line charts supported",
		})
		return
	}

	if report.Spec == nil {
		log.Println("Report spec is empty")
		ctx.JSON(400, gin.H{
			"error": "Spec for report is empty",
		})
		return
	}

	useridi, exists := ctx.Get("userid")
	if !exists {
		ctx.JSON(400, gin.H{
			"error": "userid not found in request context",
		})
		return
	}
	userid := useridi.(string)
	report.UserID = userid

	createdReport, err := r.reportRepository.CreateReport(report)
	if err != nil {
		log.Printf("Error is creating report: %+v\n", err)
		ctx.JSON(400, gin.H{
			"message": err.Error(),
		})
		return
	}

	ctx.JSON(200, gin.H{
		"reportID": createdReport.ID,
	})
}

// DeleteReport method
func (r *ReportController) DeleteReport(ctx *gin.Context) {
	idstr := ctx.Param("id")
	id, err := strconv.ParseInt(idstr, 10, 64)
	if err != nil {
		log.Printf("Error in retrieving ID from request %+v\n", err)
		ctx.JSON(400, gin.H{
			"message": fmt.Sprintf("%s is not a valid number", idstr),
		})
		return
	}

	useridi, exists := ctx.Get("userid")
	if !exists {
		ctx.JSON(400, gin.H{
			"error": "userid not found in request context",
		})
		return
	}
	userid := useridi.(string)

	err = r.reportRepository.DeleteReport(userid, id)
	if err != nil {
		log.Printf("Error in deleteing report from repository: %+v\n", err)
		ctx.JSON(400, gin.H{
			"message": err.Error(),
		})
		return
	}

	ctx.JSON(202, id)
}

// GetChartData method
func (r *ReportController) GetChartData(ctx *gin.Context) {
	idstr := ctx.Param("id")
	id, err := strconv.ParseInt(idstr, 10, 64)
	if err != nil {
		log.Printf("Error in retrieving ID from request %+v\n", err)
		ctx.JSON(400, gin.H{
			"message": fmt.Sprintf("%s is not a valid number", idstr),
		})
		return
	}

	useridi, exists := ctx.Get("userid")
	if !exists {
		ctx.JSON(400, gin.H{
			"error": "userid not found in request context",
		})
		return
	}
	userid := useridi.(string)

	reportData, err := r.reportRepository.GetChartData(userid, id)
	if err != nil {
		log.Printf("Error in retrieving report data from repository: %+v\n", err)
		ctx.JSON(400, gin.H{
			"message": err.Error(),
		})
		return
	}

	ctx.JSON(200, reportData)
}

/*
func (r *ReportController) CreateReport1(ctx *gin.Context) {
	b := bytes.NewBuffer(make([]byte, 0))
	reader := io.TeeReader(ctx.Request.Body, b)
	var report models.Report
	err := json.NewDecoder(reader).Decode(&report)
	if err != nil {
		log.Printf("error is %+v\n", err)
		ctx.JSON(400, gin.H{
			"message": err.Error(),
		})
		return
	}
	defer ctx.Request.Body.Close()
	log.Printf("Received to create Report with details %+v\n", report)
	ctx.Request.Body = ioutil.NopCloser(b)

	useridi, exists := ctx.Get("userid")
	if !exists {
		ctx.JSON(400, gin.H{
			"error": "userid not found in request context",
		})
		return
	}
	userid := useridi.(string)
	report.UserID = userid

	if report.Title == "" {
		log.Printf("Report title is invalid with value %s\n", report.Title)
		ctx.JSON(400, gin.H{
			"error": "report title should not be empty",
		})
		return
	}

	if report.Type != "pie" && report.Type != "line" {
		ctx.JSON(400, gin.H{
			"error": "Invalid report type. Only pie/line charts supported",
		})
		return
	}

	if report.Type == "pie" {
		var pieChart models.PieChart
		ctx.BindJSON(&pieChart)
		log.Printf("Received creation of Pie Chart %+v\n", pieChart)
		_, err := r.reportRepository.CreatePieChartReport(pieChart)
		if err != nil {
			ctx.JSON(400, gin.H{
				"error": err.Error(),
			})
			return
		}

		ctx.JSON(200, gin.H{
			"message": "created",
		})
		return
	}

	if report.Type == "line" {

	}

}*/
