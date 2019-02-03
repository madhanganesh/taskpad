package controllers

import (
	"database/sql"
	"log"

	"github.com/gin-gonic/gin"
	"github.com/madhanganesh/taskpad/api/repositories"
)

// UserTagsController struct
type UserTagsController struct {
	userTagsRepository *repositories.UserTagRepository
}

// Init method
func (c *UserTagsController) Init(db *sql.DB) {
	c.userTagsRepository = &repositories.UserTagRepository{}
	c.userTagsRepository.Init(db)
}

// GetUserTags method
func (c *UserTagsController) GetUserTags(ctx *gin.Context) {
	useridi, exists := ctx.Get("userid")
	if !exists {
		ctx.JSON(400, gin.H{
			"error": "userid not found in request context",
		})
		return
	}

	userid := useridi.(string)
	usertags, err := c.userTagsRepository.GetUserTags(userid)
	if err != nil {
		log.Printf("Error retrieving usertags for user %s: %+v\n", userid, err)
		ctx.JSON(400, gin.H{
			"error": err.Error(),
		})
		return
	}

	tags := []string{}
	for _, usertag := range usertags {
		tags = append(tags, usertag.Tag)
	}

	ctx.JSON(200, gin.H{
		"tags": tags,
	})
}
