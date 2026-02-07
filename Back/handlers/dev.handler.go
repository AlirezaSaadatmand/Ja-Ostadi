package handlers

import (
	"fmt"

	"github.com/AlirezaSaadatmand/Ja-Ostadi/config"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/database"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/models"
	"github.com/gofiber/fiber/v2"
)

func (h *Handler) DeleteSemesterData(c *fiber.Ctx) error {
	db := database.DB

	cfg := config.GetConfig()

	var semester models.Semester
	err := db.
		Where("name = ?", cfg.SEMESTER).
		First(&semester).Error
	if err != nil {
		return c.JSON(fiber.Map{"status": "semester not found"})
	}

	semesterID := semester.ID

	if err := db.Unscoped().Where("Semester = ?", cfg.SEMESTER).Delete(&models.Base_course_data{}).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": fmt.Sprintf("failed to delete instructor_departments: %v", err)})
	}

	var courses []models.Course
	if err := db.Where("semester_id = ?", semesterID).Find(&courses).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": fmt.Sprintf("failed to fetch courses: %v", err)})
	}

	for _, course := range courses {
		if err := db.Unscoped().Where("course_id = ?", course.ID).Delete(&models.ClassTime{}).Error; err != nil {
			return c.Status(500).JSON(fiber.Map{"error": fmt.Sprintf("failed to delete class_times: %v", err)})
		}
	}

	if err := db.Unscoped().Where("semester_id = ?", semesterID).Delete(&models.Course{}).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": fmt.Sprintf("failed to delete courses: %v", err)})
	}

	if err := db.Unscoped().Where("semester_id = ?", semesterID).Delete(&models.InstructorDepartment{}).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": fmt.Sprintf("failed to delete instructor_departments: %v", err)})
	}

	if err := db.Unscoped().Where("id = ?", semesterID).Delete(&models.Semester{}).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": fmt.Sprintf("failed to delete semester: %v", err)})
	}

	return c.JSON(fiber.Map{"status": "semester data permanently deleted"})
}
