package models

import "gorm.io/gorm"

type Course struct {
	gorm.Model
	Name          string
	Number        string
	Group         string
	Units         string
	ClassType     string
	TimeInWeek    string
	TimeRoom      string
	FinalExamTime string
	FinalExamDate string
	Capacity      string
	StudentCount  string

	SemesterID   uint
	DepartmentID uint
	InstructorID uint
}
