package services

import (
	"errors"

	"github.com/AlirezaSaadatmand/Ja-Ostadi/config"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/database"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/models"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/pkg/logging"
)

type ScheduleCourse struct {
	ID            uint   `json:"id"`
	Name          string `json:"name"`
	Number        string `json:"number"`
	Group         string `json:"group"`
	Units         string `json:"units"`
	FinalExamTime string `json:"final_exam_time"`
	FinalExamDate string `json:"final_exam_date"`
	SemesterID    uint   `json:"semester_id"`
	DepartmentID  uint   `json:"department_id"`
	InstructorID  uint   `json:"instructor_id"`
}

func (s *Services) GetCoursesSchedule() ([]ScheduleCourse, error) {
	cfg := config.GetConfig()

	var semester models.Semester
	err := database.DB.
		Where("name = ?", cfg.SEMESTER).
		First(&semester).Error
	if err != nil {
		s.Logger.Error(logging.Mysql, logging.Select, "Failed to get semester", map[logging.ExtraKey]interface{}{"semesterName": cfg.SEMESTER, "error": err.Error()})
		return nil, errors.New("error getting semester data")
	}

	var courses []ScheduleCourse
	err = database.DB.
		Model(&models.Course{}).
		Where("semester_id = ?", semester.ID).
		Order("number ASC").
		Find(&courses).Error
	if err != nil {
		s.Logger.Error(logging.Mysql, logging.Select, "Failed to get courses schedule", map[logging.ExtraKey]interface{}{"semesterID": semester.ID, "error": err.Error()})
		return nil, errors.New("error getting courses data")
	}

	s.Logger.Info(logging.Mysql, logging.Select, "Fetched courses schedule successfully", map[logging.ExtraKey]interface{}{"semesterID": semester.ID, "count": len(courses)})
	return courses, nil
}

type ScheduleInstructor struct {
	ID   uint   `json:"id"`
	Name string `json:"name"`
}

func (s *Services) GetAllInstructorsSchedule() ([]ScheduleInstructor, error) {
	var instructors []ScheduleInstructor

	err := database.DB.
		Model(&models.Instructor{}).
		Find(&instructors).Error
	if err != nil {
		s.Logger.Error(logging.Mysql, logging.Select, "Failed to get instructors schedule", map[logging.ExtraKey]interface{}{"error": err.Error()})
		return nil, errors.New("error getting instructors")
	}

	s.Logger.Info(logging.Mysql, logging.Select, "Fetched instructors schedule successfully", map[logging.ExtraKey]interface{}{})
	return instructors, nil
}

type ScheduleTimeID struct {
	CourseID  uint   `json:"course_id"`
	Day       string `json:"day"`
	StartTime string `json:"start_time"`
	EndTime   string `json:"end_time"`
	Room      string `json:"room"`
}

func (s *Services) GetAllTimesSchedule() ([]ScheduleTimeID, error) {
	var times []ScheduleTimeID

	err := database.DB.
		Model(&models.ClassTime{}).
		Find(&times).Error
	if err != nil {
		s.Logger.Error(logging.Mysql, logging.Select, "Failed to get all class schedules", map[logging.ExtraKey]interface{}{"error": err.Error()})
		return nil, errors.New("error getting times")
	}

	s.Logger.Info(logging.Mysql, logging.Select, "Fetched all class schedules successfully", nil)
	return times, nil
}

type ScheduleDepartment struct {
	ID   uint   `json:"id"`
	Name string `json:"name"`
}

func (s *Services) GetAllDepartmentsSchedule() ([]ScheduleDepartment, error) {
	var departments []ScheduleDepartment

	err := database.DB.
		Model(&models.Department{}).
		Find(&departments).Error
	if err != nil {
		s.Logger.Error(logging.Mysql, logging.Select, "Failed to get all departments schedule", map[logging.ExtraKey]interface{}{"error": err.Error()})
		return nil, errors.New("error getting departments")
	}

	s.Logger.Info(logging.Mysql, logging.Select, "Fetched all departments schedule successfully", nil)
	return departments, nil
}
