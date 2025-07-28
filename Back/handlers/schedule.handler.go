package handlers

import (
	"github.com/AlirezaSaadatmand/Ja-Ostadi/services"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/utils"
	"github.com/gofiber/fiber/v2"
)

type ScheduleData struct {
	Course services.ScheduleCourse
	Instructor services.ScheduleInstructor
	Time 
}
func GetScheduleData(c *fiber.Ctx) error {

	courses, err := services.GetCoursesSchedule()
	if err != nil {
		return utils.Error(c, fiber.StatusBadRequest, err.Error())
	}

	for _, course := range courses {
		name, err = services.GetCourseInstructor(int(course.InstructorID))
		if err != nil {
			return utils.Error(c, fiber.StatusInternalServerError, err.Error())
		}


	}
}
