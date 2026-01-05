package models

import "gorm.io/gorm"

type TempCourse struct {
	gorm.Model
	Department string
	CourseName string
	Group      string
	Units      string
	Instructor string

	FirstRoom string
	FirstDay  string
	FirstTime string
	FirstLock bool

	SecondRoom string
	SecondDay  string
	SecondTime string
	SecondLock bool

	FinalExamTime string
	FinalExamDate string

	DirectorsID string
}
