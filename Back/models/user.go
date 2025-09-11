package models

import "gorm.io/gorm"

type User struct {
	gorm.Model
	GoogleID      string `gorm:"type:varchar(255);uniqueIndex"`
	Email         string `gorm:"type:varchar(255);uniqueIndex"`
	VerifiedEmail bool
	Name          string
	GivenName     string
	FamilyName    string
	Picture       string
	Locale        string
	Provider      string `gorm:"default:google"`
}
