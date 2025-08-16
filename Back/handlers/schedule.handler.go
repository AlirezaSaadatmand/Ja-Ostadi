package handlers

import (
	"github.com/AlirezaSaadatmand/Ja-Ostadi/services"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/utils"
	"github.com/gofiber/fiber/v2"
)

type ScheduleData struct {
	Course     services.ScheduleCourse     `json:"course"`
	Instructor services.ScheduleInstructor `json:"instructor"`
	Time       []services.ScheduleTime     `json:"time"`
	Department services.ScheduleDepartment `json:"department"`
}

// GetScheduleData returns the schedule data for all courses
// @Summary Get schedule data
// @Description Returns schedule information including courses, instructors, times, and departments
// @Tags schedule
// @Produce json
// @Success 200 {object} utils.APIResponse{data=[]handlers.ScheduleData}
// @Failure 400 {object} utils.APIResponse
// @Failure 500 {object} utils.APIResponse
// @Router /schedule/data [get]
func GetScheduleData(c *fiber.Ctx) error {
	courses, err := services.GetCoursesSchedule()
	if err != nil {
		return utils.Error(c, fiber.StatusBadRequest, err.Error())
	}

	var scheduleData []ScheduleData

	for _, course := range courses {
		instructor, err := services.GetInstructorSchedule(int(course.InstructorID))
		if err != nil {
			return utils.Error(c, fiber.StatusInternalServerError, err.Error())
		}

		time, err := services.GetTimeSchedule(int(course.ID))
		if err != nil {
			return utils.Error(c, fiber.StatusInternalServerError, err.Error())
		}

		department, err := services.GetDepartmentSchedule(int(course.DepartmentID))
		if err != nil {
			return utils.Error(c, fiber.StatusInternalServerError, err.Error())
		}

		scheduleData = append(scheduleData, ScheduleData{
			Course:     course,
			Instructor: instructor,
			Time:       time,
			Department: department,
		})
	}

	return utils.Success(c, fiber.StatusOK, scheduleData, "Data fetched successfully")
}
