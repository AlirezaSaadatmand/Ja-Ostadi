package models

import "gorm.io/gorm"

const (
	CommentStatusPending  = "pending"
	CommentStatusApproved = "approved"
	CommentStatusRejected = "rejected"
)

type Comment struct {
	gorm.Model
	ClientID       uint   `gorm:"not null;index"                 json:"client_id"`
	Username       string `gorm:"not null"                       json:"username"`
	InstructorID   uint   `gorm:"not null"                       json:"instructor_id"`
	InstructorName string `gorm:"not null"                       json:"Instructor_name"`
	Content        string `gorm:"type:text;not null"             json:"content"`
	Status         string `gorm:"type:varchar(20);default:'pending'" json:"status"`
	IPAddress      string `json:"ip_address"`
}
