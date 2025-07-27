package models

import "gorm.io/gorm"

type Department struct {
    gorm.Model
    Name        string
    Instructors []InstructorDepartment
    Courses     []Course
}