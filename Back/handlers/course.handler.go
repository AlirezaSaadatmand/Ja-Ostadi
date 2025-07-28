package handlers

import (
	"strconv"

	"github.com/AlirezaSaadatmand/Ja-Ostadi/database"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/models"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/utils"
	"github.com/gofiber/fiber/v2"
)

func GetCoursesBySemester(c *fiber.Ctx) error {
	semesterID := c.Params("semesterID")
	if semesterID == "" {
		return utils.Error(c, fiber.StatusBadRequest, "semesterID is required")
	}

	id, err := strconv.ParseUint(semesterID, 10, 64)
	if err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "semesterID must be a valid number")
	}

	type CourseMinimal struct {
		ID   uint   `json:"id"`
		Name string `json:"name"`
	}

	var courses []CourseMinimal
	err = database.DB.
		Model(&models.Course{}).
		Select("ID, Name").
		Where("semester_id = ?", id).
		Find(&courses).Error
	if err != nil {
		return utils.Error(c, fiber.StatusInternalServerError, "Error getting data")
	}

	return utils.Success(c, fiber.StatusOK, courses, "Data fetched successfully")
}

func GetCoursesBySemesterAndDepartment(c *fiber.Ctx) error {
	semesterID := c.Params("semesterID")
	departmentID := c.Params("departmentID")
	if semesterID == "" || departmentID == "" {
		return utils.Error(c, fiber.StatusBadRequest, "semesterID and departmentID is required")
	}

	semester, err1 := strconv.ParseUint(semesterID, 10, 64)
	department, err2 := strconv.ParseUint(departmentID, 10, 64)
	if err1 != nil || err2 != nil {
		return utils.Error(c, fiber.StatusBadRequest, "semesterID and departmentID must be a valid number")
	}

	type CourseMinimal struct {
		ID   uint   `json:"id"`
		Name string `json:"name"`
	}

	var courses []CourseMinimal
	err := database.DB.
		Model(&models.Course{}).
		Select("ID, Name").
		Where("semester_id = ? and Department_id = ?", semester, department).
		Find(&courses).Error
	if err != nil {
		return utils.Error(c, fiber.StatusInternalServerError, "Error getting data")
	}

	return utils.Success(c, fiber.StatusOK, courses, "Data fetched successfully")
}
