package models

import "gorm.io/gorm"

type Contributor struct {
	gorm.Model
	Login         string 
	Avatar_url    string
	Html_url      string
	Contributions int
	Type          string
}