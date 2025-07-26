package models

import "gorm.io/gorm"

type ClassTime struct {
    gorm.Model
    Day       string `gorm:"not null"`
    StartTime string
    EndTime   string
    Room      string

    CourseID uint
}