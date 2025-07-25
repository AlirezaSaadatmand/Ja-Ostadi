package models

import "gorm.io/gorm"

type Semester struct {
	gorm.Model
	Name    string `gorm:"unique;not null"`
	Courses []Course
}
