package handlers

import (
	"strconv"

	"github.com/AlirezaSaadatmand/Ja-Ostadi/services"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/utils"
	"github.com/gofiber/fiber/v2"
)

func GetCoursesBySemester(c *fiber.Ctx) error {
	semesterID := c.Params("semesterID")
	if semesterID == "" {
		return utils.Error(c, fiber.StatusBadRequest, "semesterID is required")
	}

	id, err := strconv.Atoi(semesterID)
	if err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "semesterID must be a valid number")
	}

	courses, err := services.GetCoursesBySemester(id)
	if err != nil {
		return utils.Error(c, fiber.StatusInternalServerError, err.Error())
	}

	return utils.Success(c, fiber.StatusOK, courses, "Data fetched successfully")
}

func GetCoursesBySemesterAndDepartment(c *fiber.Ctx) error {
	semesterID := c.Params("semesterID")
	departmentID := c.Params("departmentID")
	if semesterID == "" || departmentID == "" {
		return utils.Error(c, fiber.StatusBadRequest, "semesterID and departmentID is required")
	}

	semester, err1 := strconv.Atoi(semesterID)
	department, err2 := strconv.Atoi(departmentID)
	if err1 != nil || err2 != nil {
		return utils.Error(c, fiber.StatusBadRequest, "semesterID and departmentID must be a valid number")
	}

	courses, err := services.GetCoursesBySemesterAndDepartment(semester, department)
	if err != nil {
		return utils.Error(c, fiber.StatusBadRequest, err.Error())
	}

	return utils.Success(c, fiber.StatusOK, courses, "Data fetched successfully")
}

type CourseDetail struct {
	Course     services.CourseDetail
	Instructor services.InstructorByID
	Department services.DepartmentMinimal
	ClassTime  []services.ScheduleTime
	Semeter    services.SemesterData
}

func GetCourseByID(c *fiber.Ctx) error {
	courseID := c.Params("courseID")
	if courseID == "" {
		return utils.Error(c, fiber.StatusBadRequest, "courseID is required")
	}

	courseInt, err := strconv.Atoi(courseID)
	if err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "courseID must be a valid number")
	}

	courseDetail, err := services.GetCourseByID(courseInt)
	if err != nil {
		return utils.Error(c, fiber.StatusInternalServerError, err.Error())
	}

	classTimeDetail, err := services.GetTimeSchedule(courseInt)
	if err != nil {
		return utils.Error(c, fiber.StatusInternalServerError, err.Error())
	}

	instructor, err := services.GetInstructorByID(int(courseDetail.InstructorID))
	if err != nil {
		return utils.Error(c, fiber.StatusInternalServerError, err.Error())
	}

	department, err := services.GetDepartmentByID(int(courseDetail.DepartmentID))
	if err != nil {
		return utils.Error(c, fiber.StatusInternalServerError, err.Error())
	}

	semeter, err := services.GetSemesterByID(int(courseDetail.SemesterID))
	if err != nil {
		return utils.Error(c, fiber.StatusInternalServerError, err.Error())
	}

	response := CourseDetail{
		Course:     courseDetail,
		Instructor: instructor,
		Department: department,
		ClassTime:  classTimeDetail,
		Semeter:    semeter,
	}

	return utils.Success(c, fiber.StatusOK, response, "Data fetched successfully")
}
