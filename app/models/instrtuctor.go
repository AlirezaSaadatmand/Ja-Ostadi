package models

import "gorm.io/gorm"

type Instructor struct {
    gorm.Model
    Name       string `gorm:"not null"` // e.g., "قبادی پور"
    Title      string // e.g., "آقاي"
    Field      string // e.g., "ریاضی"
    Courses    []Course
}
