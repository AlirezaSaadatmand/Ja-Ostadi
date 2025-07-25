package models

import "gorm.io/gorm"

type Department struct {
    gorm.Model
    Name    string   `gorm:"unique;not null"`
    Courses []Course
}
