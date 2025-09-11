package models

import "gorm.io/gorm"

type UserCourse struct {
	gorm.Model
	UserID   uint
	CourseID uint
	User     User
	Course   Course
}
