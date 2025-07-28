package services

import (
	"errors"

	"github.com/AlirezaSaadatmand/Ja-Ostadi/database"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/models"
)

type CourseMinimal struct {
	ID   uint   `json:"id"`
	Name string `json:"name"`
}

func GetCoursesBySemester(semesterID int) ([]CourseMinimal, error) {

	var courses []CourseMinimal
	err := database.DB.
		Model(&models.Course{}).
		Select("ID, Name").
		Where("semester_id = ?", semesterID).
		Find(&courses).Error
	if err != nil {
		return nil, errors.New("error getting data")
	}

	return courses, nil
}

func GetCoursesBySemesterAndDepartment(semesterID, departmentID int) ([]CourseMinimal, error) {

	var courses []CourseMinimal
	err := database.DB.
		Model(&models.Course{}).
		Select("ID, Name").
		Where("semester_id = ? and department_id = ?", semesterID, departmentID).
		Find(&courses).Error
	if err != nil {
		return nil, errors.New("error getting data")
	}

	return courses, nil
}
