package services

import (
	"errors"

	"github.com/AlirezaSaadatmand/Ja-Ostadi/database"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/models"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/pkg/logging"
)

type CourseMinimal struct {
	ID   uint   `json:"id"`
	Name string `json:"name"`
}

func (s *Services) GetCoursesBySemester(semesterID int) ([]CourseMinimal, error) {
	var courses []CourseMinimal
	err := database.DB.
		Model(&models.Course{}).
		Select("ID, Name").
		Where("semester_id = ?", semesterID).
		Find(&courses).Error

	if err != nil {
		s.Logger.Error(logging.Mysql, logging.Select, "Failed to get courses by semester", map[logging.ExtraKey]interface{}{
			"semesterID": semesterID,
			"error":      err.Error(),
		})
		return nil, errors.New("error getting data")
	}

	s.Logger.Info(logging.Mysql, logging.Select, "Fetched courses by semester successfully", map[logging.ExtraKey]interface{}{
		"semesterID": semesterID,
		"count":      len(courses),
	})

	return courses, nil
}

type CourseInstructor struct {
	ID           uint   `json:"id"`
	Name         string `json:"name"`
	InstructorID uint   `json:"instructor_id"`
}

func (s *Services) GetCoursesBySemesterAndDepartment(semesterID, departmentID int) ([]CourseInstructor, error) {
	var courses []CourseInstructor
	err := database.DB.
		Model(&models.Course{}).
		Where("semester_id = ? AND department_id = ?", semesterID, departmentID).
		Find(&courses).Error

	if err != nil {
		s.Logger.Error(logging.Mysql, logging.Select, "Failed to get courses by semester and department", map[logging.ExtraKey]interface{}{
			"semesterID":   semesterID,
			"departmentID": departmentID,
			"error":        err.Error(),
		})
		return nil, errors.New("error getting data")
	}

	s.Logger.Info(logging.Mysql, logging.Select, "Fetched courses by semester and department successfully", map[logging.ExtraKey]interface{}{
		"semesterID":   semesterID,
		"departmentID": departmentID,
		"count":        len(courses),
	})

	return courses, nil
}

type CourseDetail struct {
	ID            uint   `json:"id"`
	Name          string `json:"name"`
	Number        string `json:"number"`
	Group         string `json:"group"`
	Units         int    `json:"units"`
	ClassType     string `json:"class_type"`
	TimeInWeek    string `json:"time_in_week"`
	MidExamTime   string `json:"mid_exam_time"`
	FinalExamTime string `json:"final_exam_time"`
	Capacity      int    `json:"capacity"`
	StudentCount  int    `json:"student_count"`
	SemesterID    uint   `json:"semester_id"`
	DepartmentID  uint   `json:"department_id"`
	InstructorID  uint   `json:"instructor_id"`
}

func (s *Services) GetCourseByID(courseID int) (CourseDetail, error) {
	var course CourseDetail
	err := database.DB.
		Model(&models.Course{}).
		Where("ID = ?", courseID).
		Find(&course).Error

	if err != nil {
		s.Logger.Error(logging.Mysql, logging.Select, "Failed to get course by ID", map[logging.ExtraKey]interface{}{
			"courseID": courseID,
			"error":    err.Error(),
		})
		return course, errors.New("error getting data")
	}

	s.Logger.Info(logging.Mysql, logging.Select, "Fetched course by ID successfully", map[logging.ExtraKey]interface{}{
		"courseID": courseID,
	})

	return course, nil
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
