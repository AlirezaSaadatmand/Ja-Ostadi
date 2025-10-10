package models

import "gorm.io/gorm"

type DayMeals struct {
	gorm.Model
	WeekID uint
	Day    string
	Date   string
	Meals  []Meal `gorm:"foreignKey:DayID"`
}
