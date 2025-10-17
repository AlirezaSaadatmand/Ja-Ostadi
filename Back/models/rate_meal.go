package models

import "gorm.io/gorm"

type RateMeal struct {
	gorm.Model
	UserId uint
	MealId uint
	Rating int
	Comment string
}
