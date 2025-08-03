package services

import (
	"errors"

	"github.com/AlirezaSaadatmand/Ja-Ostadi/database"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/models"
)

type DepartmentMinimal struct {
	ID   uint   `json:"id"`
	Name string `json:"name"`
}

func GetDepartments() ([]DepartmentMinimal, error) {

	var departments []DepartmentMinimal
	err := database.DB.
		Model(&models.Department{}).
		Select("id, name").
		Find(&departments).Error
	if err != nil {
		return nil, errors.New("error getting data")
	}

	return departments, nil
}


type DepartmentDataResponse struct {
    ID               uint   `json:"id"`
    Name             string `json:"name"`
    InstructorsCount int64  `json:"instructors_count"`
    CoursesCount     int64  `json:"courses_count"`
}

func GetDepartmentsDataService() ([]DepartmentDataResponse, error) {
    db := database.DB

    var departments []models.Department
    if err := db.Find(&departments).Error; err != nil {
        return nil, err
    }

    var result []DepartmentDataResponse

    for _, dept := range departments {
        var instructorsCount int64
        var coursesCount int64

        db.Model(&models.InstructorDepartment{}).
            Where("department_id = ?", dept.ID).
            Count(&instructorsCount)

        db.Model(&models.Course{}).
            Where("department_id = ?", dept.ID).
            Count(&coursesCount)

        result = append(result, DepartmentDataResponse{
            ID:               dept.ID,
            Name:             dept.Name,
            InstructorsCount: instructorsCount,
            CoursesCount:     coursesCount,
        })
    }

    return result, nil
}