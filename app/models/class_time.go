package models

import "gorm.io/gorm"

type ClassTime struct {
    gorm.Model
    Day       string `gorm:"not null"` // e.g., "دوشنبه"
    StartTime string // e.g., "17:30"
    EndTime   string // e.g., "19:15"
    Room      string

    CourseID uint
}
