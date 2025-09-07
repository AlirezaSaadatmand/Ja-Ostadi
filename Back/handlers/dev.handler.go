package handlers

import (
	"fmt"

	"github.com/AlirezaSaadatmand/Ja-Ostadi/database"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/models"
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func (h *Handler) DeleteAllData(c *fiber.Ctx) error {
	db := database.DB

	// Order matters - delete dependent tables first
	tables := []struct {
		model interface{}
		table string
	}{
		{model: &models.InstructorDepartment{}, table: "instructor_departments"},
		{model: &models.Course{}, table: "courses"},
		{model: &models.Instructor{}, table: "instructors"},
		{model: &models.Department{}, table: "departments"},
		{model: &models.Semester{}, table: "semesters"},
		{model: &models.ClassTime{}, table: "class_times"},
		{model: &models.Base_course_data{}, table: "base_course_data"},

	}

	for _, t := range tables {
		if err := db.Exec("DELETE FROM " + t.table).Error; err != nil {
			if err := db.Unscoped().Session(&gorm.Session{AllowGlobalUpdate: true}).Delete(t.model).Error; err != nil {
				return c.Status(500).JSON(fiber.Map{
					"error": fmt.Sprintf("Failed to clear %s: %v", t.table, err),
				})
			}
		}
	}

	return c.JSON(fiber.Map{"status": "all data deleted successfully"})
}
