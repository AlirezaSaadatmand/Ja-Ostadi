package services

import (
	"errors"

	"github.com/AlirezaSaadatmand/Ja-Ostadi/database"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/models"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/pkg/logging"

)

type ScheduleCourse struct {
	ID           uint   `json:"id"`
	Name         string `json:"name"`
	Number       string `json:"number"`
	Group        string `json:"group"`
	Units        int    `json:"units"`
	SemesterID   uint   `json:"semester_id"`
	DepartmentID uint   `json:"department_id"`
	InstructorID uint   `json:"instructor_id"`
}

func (s *Services) GetCoursesSchedule() ([]ScheduleCourse, error) {

	semesterID := 2

	var courses []ScheduleCourse
	err := database.DB.
		Model(&models.Course{}).
		Where("semester_id = ?", semesterID).
		Find(&courses).Error
	if err != nil {
		s.Logger.Error(logging.Mysql, logging.Select, "Failed to get courses schedule", map[logging.ExtraKey]interface{}{"semesterID": semesterID, "error": err.Error()})
		return nil, errors.New("error getting data")
	}

	s.Logger.Info(logging.Mysql, logging.Select, "Fetched courses schedule successfully", map[logging.ExtraKey]interface{}{"semesterID": semesterID, "count": len(courses)})
	return courses, nil
}


type ScheduleInstructor struct {
	Name string `json:"name"`
}

func (s *Services) GetInstructorSchedule(instructorId int) (ScheduleInstructor, error) {
	var instructor ScheduleInstructor

	err := database.DB.
		Model(&models.Instructor{}).
		Where("id = ?", instructorId).
		Find(&instructor).Error
	if err != nil {
		s.Logger.Error(logging.Mysql, logging.Select, "Failed to get instructor schedule", map[logging.ExtraKey]interface{}{"instructorId": instructorId, "error": err.Error()})
		return instructor, errors.New("error getting data")
	}

	s.Logger.Info(logging.Mysql, logging.Select, "Fetched instructor schedule successfully", map[logging.ExtraKey]interface{}{"instructorId": instructorId})
	return instructor, nil
}


type ScheduleTime struct {
	Day       string `json:"day"`
	StartTime string `json:"start_time"`
	EndTime   string `json:"end_time"`
	Room      string `json:"room"`
}

func (s *Services) GetTimeSchedule(courseId int) ([]ScheduleTime, error) {
	var classTime []ScheduleTime

	err := database.DB.
		Model(&models.ClassTime{}).
		Where("course_id = ?", courseId).
		Find(&classTime).Error
	if err != nil {
		s.Logger.Error(logging.Mysql, logging.Select, "Failed to get class schedule", map[logging.ExtraKey]interface{}{"courseId": courseId, "error": err.Error()})
		return nil, errors.New("error getting data")
	}

	s.Logger.Info(logging.Mysql, logging.Select, "Fetched class schedule successfully", map[logging.ExtraKey]interface{}{"courseId": courseId})
	return classTime, nil
}


type ScheduleDepartment struct {
	Name string `json:"name"`
}

func (s *Services) GetDepartmentSchedule(departmentId int) (ScheduleDepartment, error) {
	var department ScheduleDepartment

	err := database.DB.
		Model(&models.Department{}).
		Where("id = ?", departmentId).
		Find(&department).Error
	if err != nil {
		s.Logger.Error(logging.Mysql, logging.Select, "Failed to get department schedule", map[logging.ExtraKey]interface{}{"departmentId": departmentId, "error": err.Error()})
		return department, errors.New("error getting data")
	}

	s.Logger.Info(logging.Mysql, logging.Select, "Fetched department schedule successfully", map[logging.ExtraKey]interface{}{"departmentId": departmentId})
	return department, nil
}
