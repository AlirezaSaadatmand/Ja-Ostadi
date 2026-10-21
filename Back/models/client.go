package models

import "gorm.io/gorm"

type Client struct {
	gorm.Model
	Username string `gorm:"unique;not null" json:"username"`
	Password string `gorm:"not null"        json:"-"`
	Role     string `gorm:"not null"        json:"role"`
}