package models

import "gorm.io/gorm"

type Class struct {
    gorm.Model
    Room      string `gorm:"not null"`
}