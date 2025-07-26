package models

import "gorm.io/gorm"

type InstructorDepartment struct {
    gorm.Model
    InstructorID uint `gorm:"not null;index"`
    DepartmentID uint `gorm:"not null;index"`

    Instructor   Instructor  `gorm:"foreignKey:InstructorID"`
    Department   Department  `gorm:"foreignKey:DepartmentID"`
}
