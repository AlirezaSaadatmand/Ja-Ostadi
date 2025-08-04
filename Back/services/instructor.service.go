package services

import (
	"errors"

	"github.com/AlirezaSaadatmand/Ja-Ostadi/database"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/models"
)

type InstructorMinimal struct {
	Name  string `json:"name"`
	Field string `json:"field"`
}

func GetInstructorData(instructorId int) (InstructorMinimal, error) {

	var instructor InstructorMinimal
	err := database.DB.
		Model(&models.Instructor{}).
		Select("Name, field").
		Where("id = ?", instructorId).
		Find(&instructor).Error
	if err != nil {
		return instructor, errors.New("error getting data")
	}

	return instructor, nil
}


type InstructorRelations struct {
	InstructorID uint `json:"instructor_id"`
	DepartmentID uint `json:"department_id"`
	SemesterID   uint `json:"semester_id"`
}

func GetInstructorRelations() ([]InstructorRelations, error) {

	var relations []InstructorRelations
	err := database.DB.
		Model(&models.InstructorDepartment{}).
		Select("instructor_id, department_id, semester_id").
		Find(&relations).Error
	if err != nil {
		return nil, errors.New("error getting data")
	}

	return relations, nil
}
