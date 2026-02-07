package services

import (
	"errors"

	"github.com/AlirezaSaadatmand/Ja-Ostadi/config"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/database"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/models"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/pkg/logging"
)

type DepartmentMinimal struct {
	ID   uint   `json:"id"`
	Name string `json:"name"`
}

func (s *Services) GetDepartments() ([]DepartmentMinimal, error) {
	var departments []DepartmentMinimal

	err := database.DB.Model(&models.Department{}).
		Select("id, name").
		Find(&departments).Error

	if err != nil {
		s.Logger.Error(logging.Mysql, logging.Select, "Failed to get departments", map[logging.ExtraKey]interface{}{"error": err})
		return nil, errors.New("error getting data")
	}

	s.Logger.Info(logging.Mysql, logging.Select, "Fetched departments successfully", map[logging.ExtraKey]interface{}{"count": len(departments)})

	return departments, nil
}

type DepartmentDataResponse struct {
	ID               uint   `json:"id"`
	Name             string `json:"name"`
	InstructorsCount int64  `json:"instructors_count"`
	CoursesCount     int64  `json:"courses_count"`
}

func (s *Services) GetDepartmentsDataService() ([]DepartmentDataResponse, error) {
	db := database.DB

	var departments []models.Department
	if err := db.Find(&departments).Error; err != nil {
		s.Logger.Error(logging.Mysql, logging.Select, "Failed to get list of departments",
			map[logging.ExtraKey]interface{}{"error": err})
		return nil, errors.New("error getting departments")
	}

	cfg := config.GetConfig()

	var semester models.Semester
	err := database.DB.
		Where("name = ?", cfg.SEMESTER).
		First(&semester).Error
	if err != nil {
		s.Logger.Error(logging.Mysql, logging.Select, "Failed to get semester", map[logging.ExtraKey]interface{}{"semesterName": cfg.SEMESTER, "error": err.Error()})
		return nil, errors.New("error getting semester data")
	}

	var result []DepartmentDataResponse

	for _, dept := range departments {
		var instructorsCount int64
		var coursesCount int64

		db.Model(&models.InstructorDepartment{}).
			Where("department_id = ? AND semester_id = ?", dept.ID, semester.ID).
			Count(&instructorsCount)

		db.Model(&models.Course{}).
			Where("department_id = ? and semester_id = ?", dept.ID, semester.ID).
			Count(&coursesCount)

		result = append(result, DepartmentDataResponse{
			ID:               dept.ID,
			Name:             dept.Name,
			InstructorsCount: instructorsCount,
			CoursesCount:     coursesCount,
		})
	}

	s.Logger.Info(logging.Mysql, logging.Select, "Fetched department data successfully", map[logging.ExtraKey]interface{}{"count": len(result)})

	return result, nil
}

func (s *Services) GetDepartmentByID(departmentID int) (DepartmentMinimal, error) {
	var department DepartmentMinimal

	err := database.DB.
		Model(&models.Department{}).
		Select("id, name").
		Where("id = ?", departmentID).
		Find(&department).Error

	if err != nil {
		s.Logger.Error(logging.Mysql, logging.Select, "Failed to get department by ID", map[logging.ExtraKey]interface{}{"error": err, "departmentID": departmentID})
		return department, errors.New("error getting data")
	}

	s.Logger.Info(logging.Mysql, logging.Select, "Fetched department by ID successfully", map[logging.ExtraKey]interface{}{"departmentID": departmentID})

	return department, nil
}
