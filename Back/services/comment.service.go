package services

import (
	"crypto/subtle"
	"errors"
	"time"

	"github.com/AlirezaSaadatmand/Ja-Ostadi/config"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/pkg/logging"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/database"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/models"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/utils"
)

func (s *Services) AdminLogin(password string) (string, error) {
	cfg := config.GetConfig()
	expected := cfg.AdminToken

	if expected == "" {
		s.Logger.Error(logging.Auth, logging.AdminAccess, "AdminToken is not configured", nil)
		return "", errors.New("server configuration error")
	}

	if subtle.ConstantTimeCompare([]byte(password), []byte(expected)) != 1 {
		s.Logger.Warn(logging.Auth, logging.AdminAccess, "Failed admin login attempt", nil)
		return "", errors.New("invalid credentials")
	}

	s.Logger.Info(logging.Auth, logging.AdminAccess, "Admin logged in successfully", nil)
	return expected, nil
}

type CreateCommentInput struct {
	InstructorID uint   `json:"instructor_id"`
	Content      string `json:"content"`
}

type CommentData struct {
	ID        uint      `json:"id"`
	Content   string    `json:"content"`
	CreatedAt time.Time `json:"created_at"`
}

func (s *Services) CreateComment(instructorID uint, content, ip string) error {
	content = utils.SanitizeComment(content)

	if err := utils.ValidateCommentContent(content); err != nil {
		return err
	}

	comment := models.Comment{
		InstructorID: instructorID,
		Content:      content,
		Status:       models.CommentStatusPending,
		IPAddress:    ip,
	}

	if err := database.DB.Create(&comment).Error; err != nil {
		s.Logger.Error(logging.Mysql, logging.Insert, "Failed to create comment", map[logging.ExtraKey]interface{}{"error": err.Error()})
		return errors.New("error creating comment")
	}

	s.Logger.Info(logging.Mysql, logging.Insert, "Comment created successfully", map[logging.ExtraKey]interface{}{"commentID": comment.ID})
	return nil
}

func (s *Services) GetApprovedComments(instructorID uint) ([]CommentData, error) {
	var comments []CommentData
	err := database.DB.
		Model(&models.Comment{}).
		Select("id, content, created_at").
		Where("instructor_id = ? AND status = ?", instructorID, models.CommentStatusApproved).
		Order("created_at DESC").
		Find(&comments).Error
	if err != nil {
		s.Logger.Error(logging.Mysql, logging.Select, "Failed to fetch comments", map[logging.ExtraKey]interface{}{"error": err.Error()})
		return nil, errors.New("error getting data")
	}

	return comments, nil
}