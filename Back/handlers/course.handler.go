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
		return utils.Error(c, fiber.StatusBadRequest, err.Error())
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
