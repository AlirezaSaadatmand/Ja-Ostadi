package handlers

import (
	"github.com/AlirezaSaadatmand/Ja-Ostadi/services"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/utils"
	"github.com/gofiber/fiber/v2"
)

type ScheduleData struct {
	Course     services.ScheduleCourse     `json:"course"`
	Instructor services.ScheduleInstructor `json:"instructor"`
	Time       []services.ScheduleTimeID   `json:"time"`
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
func (h *Handler) GetScheduleData(c *fiber.Ctx) error {
	courses, err := h.Services.GetCoursesSchedule()
	if err != nil {
		return utils.Error(c, fiber.StatusBadRequest, err.Error())
	}

	instructors, _ := h.Services.GetAllInstructorsSchedule()
	times, _ := h.Services.GetAllTimesSchedule()
	departments, _ := h.Services.GetAllDepartmentsSchedule()

	instructorMap := make(map[int]services.ScheduleInstructor)
	for _, i := range instructors {
		instructorMap[int(i.ID)] = i
	}

	departmentMap := make(map[int]services.ScheduleDepartment)
	for _, d := range departments {
		departmentMap[int(d.ID)] = d
	}

	timeMap := make(map[int][]services.ScheduleTimeID)
	for _, t := range times {
		timeMap[int(t.CourseID)] = append(timeMap[int(t.CourseID)], t)
	}

	var scheduleData []ScheduleData

	for _, course := range courses {
		scheduleData = append(scheduleData, ScheduleData{
			Course:     course,
			Instructor: instructorMap[int(course.InstructorID)],
			Time:       timeMap[int(course.ID)],
			Department: departmentMap[int(course.DepartmentID)],
		})
	}

	return utils.Success(c, fiber.StatusOK, scheduleData, "Data fetched successfully")
}
