package repositories

import (
	"database/sql"
	"log"

	"github.com/madhanganesh/taskpad/api/models"
)

// UserTagRepository struct
type UserTagRepository struct {
	db *sql.DB
}

// Init method
func (r *UserTagRepository) Init(db *sql.DB) {
	r.db = db
}

// GetUserTags method
func (r *UserTagRepository) GetUserTags(userid string) ([]models.UserTag, error) {
	query := `select userid, tag from usertags where userid = $1`

	rows, err := r.db.Query(query, userid)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	return getTagsFromRows(rows)
}

// SetUserTags method
func (r *UserTagRepository) SetUserTags(userid string, tags []string) {
	statement := `
    insert into usertags (userid, tag)
    values ($1, $2)
    on conflict(userid, tag)
    do nothing
  `
	for _, tag := range tags {
		_, err := r.db.Exec(statement, userid, tag)
		if err != nil {
			log.Printf("Error %+v\n", err)
		}
	}
}

func getTagsFromRows(rows *sql.Rows) ([]models.UserTag, error) {
	usertags := []models.UserTag{}
	for rows.Next() {
		var usertag models.UserTag
		err := rows.Scan(&usertag.UserID, &usertag.Tag)
		if err != nil {
			return nil, err
		}

		usertags = append(usertags, usertag)
	}

	return usertags, nil
}
