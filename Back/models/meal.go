package models

import "gorm.io/gorm"

type Meal struct {
	gorm.Model
	DayID       uint
	Type        string
	Name        string
	Price       string
	Rating      float64
	Description string
	Place       string

	ImageID *uint
	Image   *MealImage `gorm:"foreignKey:ImageID"`
}
