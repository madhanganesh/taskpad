package repositories

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"regexp"
	"strings"

	"github.com/madhanganesh/taskpad/api/models"
)

// ReportRepository struct
type ReportRepository struct {
	db *sql.DB
}

// Init method
func (r *ReportRepository) Init(db *sql.DB) {
	r.db = db
}

// GetReports method
func (r *ReportRepository) GetReports(userid string) ([]models.Report, error) {
	query := `
    select id, userid, title, type from reports
    where userid = $1
  `

	rows, err := r.db.Query(query, userid)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	reports := []models.Report{}
	for rows.Next() {
		var report models.Report
		err := rows.Scan(&report.ID, &report.UserID, &report.Title, &report.Type)
		if err != nil {
			return nil, err
		}

		reports = append(reports, report)
	}

	return reports, nil
}

// CreateReport method
func (r *ReportRepository) CreateReport(report models.Report) (models.Report, error) {
	specBytes, err := json.Marshal(report.Spec)
	if err != nil {
		return report, err
	}
	spec := string(specBytes)

	statement := `
    insert into reports(userid, title, type, spec)
    values ($1, $2, $3, $4)
    returning id
  `

	var id int64
	err = r.db.QueryRow(statement, report.UserID, report.Title, report.Type, spec).Scan(&id)
	if err != nil {
		return report, err
	}
	createdReport := report
	createdReport.ID = id
	return createdReport, nil
}

// DeleteReport method
func (r *ReportRepository) DeleteReport(userid string, reportid int64) error {
	statement := `delete from reports where userid=$1 and id=$2`
	res, err := r.db.Exec(statement, userid, reportid)
	if err != nil {
		log.Printf("report-repository : delete report : error in Exec: %+v\n", err)
		return err
	}

	count, err := res.RowsAffected()
	if err != nil {
		log.Printf("report-repository : delete report : error in RowsAffected: %+v\n", err)
		return err
	}
	if count != 1 {
		return fmt.Errorf("exactly 1 row is not impacted for %d", reportid)
	}

	return nil
}

// GetChartData method
func (r *ReportRepository) GetChartData(userid string, reportid int64) (models.ReportData, error) {
	query := `
    select id, userid, title, type, spec
    from reports
    where userid = $1 and id = $2
  `
	row := r.db.QueryRow(query, userid, reportid)
	var spec string
	var report models.Report
	err := row.Scan(&report.ID, &report.UserID, &report.Title, &report.Type, &spec)
	if err != nil {
		return models.ReportData{}, err
	}

	specBytes := []byte(spec)
	var pieChart models.PieChart
	err = json.Unmarshal(specBytes, &pieChart)
	if err != nil {
		return models.ReportData{}, err
	}

	tagsSeperatedWithOr := strings.Join(pieChart.Tags, "|")
	tagsSeperatedWithOr = "(" + tagsSeperatedWithOr + ")"

	re := regexp.MustCompile(tagsSeperatedWithOr)
	effortPerPie := map[string]float32{}
	for _, pieChartGroup := range pieChart.PieChartGroups {
		s := re.ReplaceAllString(pieChartGroup.Spec, `tags ~ '$1(;|$)'`)
		query := `
		      select sum(effort) ` + pieChartGroup.Name + `
		      from tasks
          where userid=$1
          and tags <> ''
          and
		    `
		query += s

		row := r.db.QueryRow(query, userid)
		var effort float32
		err := row.Scan(&effort)
		if err != nil {
			log.Printf("Error in repository while querying effort for query %s\n", query)
			return models.ReportData{}, err
		}

		fmt.Printf("Effort for %s is %f\n", pieChartGroup.Name, effort)
		effortPerPie[pieChartGroup.Name] = effort
	}

	_ = json.Unmarshal(specBytes, &report.Spec)
	var reportData models.ReportData
	reportData.Report = report
	reportData.Data = effortPerPie

	return reportData, nil
}
