package models

import "gorm.io/gorm"

const (
	CommentStatusPending  = "pending"
	CommentStatusApproved = "approved"
	CommentStatusRejected = "rejected"
)

type Comment struct {
	gorm.Model
	InstructorID uint   `gorm:"not null"`
	Content      string `gorm:"type:text;not null"`
	Status       string `gorm:"type:varchar(20);default:'pending'"`
	IPAddress    string 
}