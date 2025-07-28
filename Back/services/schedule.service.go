package services

import (
	"errors"

	"github.com/AlirezaSaadatmand/Ja-Ostadi/database"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/models"
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

func GetCoursesSchedule() ([]ScheduleCourse, error) {

	semesterID := 2

	var courses []ScheduleCourse
	err := database.DB.
		Model(&models.Course{}).
		Where("semester_id = ?", semesterID).
		Find(&courses).Error
	if err != nil {
		return nil, errors.New("error getting data")
	}

	return courses, nil
}

type ScheduleInstructor struct {
	Name string `json:"name"`
}

func GetInstructorSchedule(instructorId int) (ScheduleInstructor, error) {
	var instructor ScheduleInstructor

	err := database.DB.
		Model(&models.Instructor{}).
		Where("id = ?", instructorId).
		Find(&instructor).Error
	if err != nil {
		return instructor, errors.New("error getting data")
	}

	return instructor, nil
}

type ScheduleTime struct {
	Day       string `json:"day"`
	StartTime string `json:"start_time"`
	EndTime   string `json:"end_time"`
	Room      string `json:"room"`
}

func GetTimeSchedule(courseId int) ([]ScheduleTime, error) {
	var instructor []ScheduleTime

	err := database.DB.
		Model(&models.ClassTime{}).
		Where("course_id = ?", courseId).
		Find(&instructor).Error
	if err != nil {
		return nil, errors.New("error getting data")
	}

	return instructor, nil
}
