package models

import "gorm.io/gorm"

type WeekMeals struct {
	gorm.Model
	Week  string
	Meals []DayMeals `gorm:"foreignKey:WeekID"`
}
