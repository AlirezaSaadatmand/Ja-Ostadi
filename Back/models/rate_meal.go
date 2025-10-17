package models

import "gorm.io/gorm"

type RateMeal struct {
	gorm.Model
	UserId uint
	MealId int
	Rating int
	Comment string
}
