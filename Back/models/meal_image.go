package models

import "gorm.io/gorm"

type MealImage struct {
	gorm.Model
	ImageURL string
	Keywords string
}
