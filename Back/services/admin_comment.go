package services

import (
	"errors"
	"time"

	"github.com/AlirezaSaadatmand/Ja-Ostadi/database"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/models"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/pkg/logging"
)

type AdminCommentData struct {
	ID           uint      `json:"id"`
	InstructorID uint      `json:"instructor_id"`
	Content      string    `json:"content"`
	Status       string    `json:"status"`
	IPAddress    string    `json:"ip_address"`
	CreatedAt    time.Time `json:"created_at"`
}

func (s *Services) AdminGetComments(status string, page, limit int) ([]AdminCommentData, int64, error) {
	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 100 {
		limit = 20
	}

	query := database.DB.Model(&models.Comment{})

	if status != "" {
		query = query.Where("status = ?", status)
	}

	var total int64
	if err := query.Count(&total).Error; err != nil {
		s.Logger.Error(logging.Mysql, logging.Select, "Failed to count comments", map[logging.ExtraKey]interface{}{"error": err.Error()})
		return nil, 0, errors.New("error getting data")
	}

	var comments []AdminCommentData
	err := query.
		Select("id, instructor_id, content, status, ip_address, created_at").
		Order("created_at DESC").
		Offset((page - 1) * limit).
		Limit(limit).
		Find(&comments).Error
	if err != nil {
		s.Logger.Error(logging.Mysql, logging.Select, "Failed to fetch comments", map[logging.ExtraKey]interface{}{"error": err.Error()})
		return nil, 0, errors.New("error getting data")
	}

	return comments, total, nil
}

func (s *Services) AdminUpdateCommentStatus(id uint, status string) error {
	if status != models.CommentStatusApproved && status != models.CommentStatusRejected && status != models.CommentStatusPending {
		return errors.New("invalid status")
	}

	result := database.DB.
		Model(&models.Comment{}).
		Where("id = ?", id).
		Update("status", status)

	if result.Error != nil {
		s.Logger.Error(logging.Mysql, logging.Update, "Failed to update comment status", map[logging.ExtraKey]interface{}{"error": result.Error.Error()})
		return errors.New("error updating comment")
	}
	if result.RowsAffected == 0 {
		return errors.New("comment not found")
	}

	s.Logger.Info(logging.Mysql, logging.Update, "Comment status updated", map[logging.ExtraKey]interface{}{"commentID": id, "status": status})
	return nil
}

func (s *Services) AdminDeleteComment(id uint) error {
	result := database.DB.Delete(&models.Comment{}, id)
	if result.Error != nil {
		s.Logger.Error(logging.Mysql, logging.Delete, "Failed to delete comment", map[logging.ExtraKey]interface{}{"error": result.Error.Error()})
		return errors.New("error deleting comment")
	}
	if result.RowsAffected == 0 {
		return errors.New("comment not found")
	}

	s.Logger.Info(logging.Mysql, logging.Delete, "Comment deleted", map[logging.ExtraKey]interface{}{"commentID": id})
	return nil
}