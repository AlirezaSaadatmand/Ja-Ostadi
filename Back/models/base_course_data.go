package models

import "gorm.io/gorm"

type Base_course_data struct {
    gorm.Model
	Semester       string 
	Department     string 
	CourseName     string 
	CourseNumber   string `gorm:"primaryKey"`
	Group          string 
	Units          string 
	ClassType      string 
	Instructor     string 
	TimeInWeek     string 
	TimeRoom       string 
	MidExamTime    string 
	FinalExamDate  string 
	Capacity       string 
	StudentCount   string
}