package services

import (
	"errors"

	"github.com/AlirezaSaadatmand/Ja-Ostadi/database"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/models"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/pkg/logging"
)

type InstructorMinimal struct {
	ID    uint `json:"id"`
	Name  string `json:"name"`
	Field string `json:"field"`
}

func (s *Services) GetInstructorData() ([]InstructorMinimal, error) {
	var instructors []InstructorMinimal

	err := database.DB.
		Model(&models.Instructor{}).
		Select("id, name, field").
		Find(&instructors).Error

	if err != nil {
		s.Logger.Error(logging.Mysql, logging.Select, "Failed to get instructor data", map[logging.ExtraKey]interface{}{"error": err.Error()})
		return nil, errors.New("error getting data")
	}

	s.Logger.Info(logging.Mysql, logging.Select, "Fetched instructor data successfully", map[logging.ExtraKey]interface{}{})
	return instructors, nil
}

type InstructorRelations struct {
	InstructorID uint `json:"instructor_id"`
	DepartmentID uint `json:"department_id"`
	SemesterID   uint `json:"semester_id"`
}

func (s *Services) GetInstructorRelations() ([]InstructorRelations, error) {

	var relations []InstructorRelations
	err := database.DB.
		Model(&models.InstructorDepartment{}).
		Select("instructor_id, department_id, semester_id").
		Find(&relations).Error
	if err != nil {
		s.Logger.Error(logging.Mysql, logging.Select, "Failed to get instructor relations", map[logging.ExtraKey]interface{}{"error": err.Error()})
		return nil, errors.New("error getting data")
	}

	s.Logger.Info(logging.Mysql, logging.Select, "Fetched instructor relations successfully", map[logging.ExtraKey]interface{}{"count": len(relations)})
	return relations, nil
}

type InstructorCourse struct {
	ID   uint   `json:"id"`
	Name string `json:"name"`
}

func (s *Services) GetInstructorCourses(instructorId, semesterId int) ([]InstructorCourse, error) {

	var courses []InstructorCourse
	err := database.DB.
		Model(&models.Course{}).
		Select("id, name").
		Where("instructor_id = ? AND semester_id = ?", instructorId, semesterId).
		Find(&courses).Error
	if err != nil {
		s.Logger.Error(logging.Mysql, logging.Select, "Failed to get instructor courses", map[logging.ExtraKey]interface{}{"instructorID": instructorId, "semesterID": semesterId, "error": err.Error()})
		return nil, errors.New("error getting data")
	}

	s.Logger.Info(logging.Mysql, logging.Select, "Fetched instructor courses successfully", map[logging.ExtraKey]interface{}{"instructorID": instructorId, "semesterID": semesterId, "count": len(courses)})
	return courses, nil
}

type InstructorByID struct {
	ID    uint   `json:"id"`
	Name  string `json:"name"`
	Field string `json:"field"`
}

func (s *Services) GetInstructorByID(instructorId int) (InstructorByID, error) {

	var instructor InstructorByID
	err := database.DB.
		Model(&models.Instructor{}).
		Select("id, name, field").
		Where("id = ?", instructorId).
		Find(&instructor).Error
	if err != nil {
		s.Logger.Error(logging.Mysql, logging.Select, "Failed to get instructor by ID", map[logging.ExtraKey]interface{}{"instructorID": instructorId, "error": err.Error()})
		return instructor, errors.New("error getting data")
	}

	s.Logger.Info(logging.Mysql, logging.Select, "Fetched instructor by ID successfully", map[logging.ExtraKey]interface{}{"instructorID": instructorId})
	return instructor, nil
}
