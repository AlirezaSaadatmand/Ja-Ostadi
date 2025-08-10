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

func GetCourseByID(courseID int) (CourseDetail, error) {

	var course CourseDetail
	err := database.DB.
		Model(&models.Course{}).
		Where("ID = ?", courseID).
		Find(&course).Error
	if err != nil {
		return course, errors.New("error getting data")
	}

	return course, nil
}
