package models

import "gorm.io/gorm"

type Course struct {
	gorm.Model
	Name          string
	Number        string 
	Group         string
	Units         int
	ClassType     string
	TimeInWeek    string
	TimeRoom      string
	MidExamTime   string
	FinalExamTime string
	Capacity      int
	StudentCount  int

	SemesterID   uint
	DepartmentID uint
	InstructorID uint
}
