package models

import "gorm.io/gorm"

type Instructor struct {
    gorm.Model
    Name         string
    Field        string
    Departments  []InstructorDepartment
    Courses      []Course
}
