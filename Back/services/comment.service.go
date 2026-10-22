package services

import (
	"errors"
	"time"

	"github.com/AlirezaSaadatmand/Ja-Ostadi/pkg/logging"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/database"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/models"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/utils"
)

type CreateCommentInput struct {
	InstructorID uint   `json:"instructor_id"`
	Content      string `json:"content"`
}

type CommentData struct {
	ID        uint      `json:"id"`
	Username  string    `json:"username"`
	Content   string    `json:"content"`
	CreatedAt time.Time `json:"created_at"`
}

func (s *Services) CreateComment(clientID uint, username string, instructorID uint, content, ip string) error {
	content = utils.SanitizeComment(content)

	if err := utils.ValidateCommentContent(content); err != nil {
		return err
	}

	var instructor models.Instructor
	if err := database.DB.First(&instructor, instructorID).Error; err != nil {
		s.Logger.Error(logging.Mysql, logging.Select, "Failed to find instructor for comment",
			map[logging.ExtraKey]interface{}{"error": err.Error(), "instructorID": instructorID})
		return errors.New("instructor not found")
	}

	comment := models.Comment{
		ClientID:       clientID,
		Username:       username,
		InstructorID:   instructorID,
		InstructorName: instructor.Name,
		Content:        content,
		Status:         models.CommentStatusPending,
		IPAddress:      ip,
	}

	if err := database.DB.Create(&comment).Error; err != nil {
		s.Logger.Error(logging.Mysql, logging.Insert, "Failed to create comment",
			map[logging.ExtraKey]interface{}{"error": err.Error()})
		return errors.New("error creating comment")
	}

	s.Logger.Info(logging.Mysql, logging.Insert, "Comment created successfully",
		map[logging.ExtraKey]interface{}{
			"commentID": comment.ID,
			"clientID":  clientID,
			"username":  username,
		})
	return nil
}

func (s *Services) GetApprovedComments(instructorID uint) ([]CommentData, error) {
	var comments []CommentData
	err := database.DB.
		Model(&models.Comment{}).
		Select("id, username, content, created_at").
		Where("instructor_id = ? AND status = ?", instructorID, models.CommentStatusApproved).
		Order("created_at DESC").
		Find(&comments).Error
	if err != nil {
		s.Logger.Error(logging.Mysql, logging.Select, "Failed to fetch comments",
			map[logging.ExtraKey]interface{}{"error": err.Error()})
		return nil, errors.New("error getting data")
	}

	return comments, nil
}

func (s *Services) GetCommentsByClient(clientID uint) ([]models.Comment, error) {
	var comments []models.Comment
	if err := database.DB.
		Where("client_id = ?", clientID).
		Order("created_at DESC").
		Find(&comments).Error; err != nil {
		s.Logger.Error(logging.Mysql, logging.Select, "Failed to fetch client comments",
			map[logging.ExtraKey]interface{}{
				"clientID": clientID,
				"error":    err.Error(),
			})
		return nil, errors.New("failed to fetch comments")
	}
	return comments, nil
}