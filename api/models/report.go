package models

// Report struct
type Report struct {
	ID     int64       `json:"id"`
	UserID string      `json:"userid"`
	Title  string      `json:"title"`
	Type   string      `json:"type"`
	Spec   interface{} `json:"spec"`
}

// PieChartGroup struct
type PieChartGroup struct {
	Name string `json:"name"`
	Spec string `json:"spec"`
}

// PieChart struct
type PieChart struct {
	Tags           []string
	PieChartGroups []PieChartGroup `json:"groups"`
}

// ReportData struct
type ReportData struct {
	Report
	Data interface{} `json:"data"`
}
