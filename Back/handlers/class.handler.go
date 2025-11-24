package handlers

import (
	"slices"

	"github.com/AlirezaSaadatmand/Ja-Ostadi/services"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/utils"
	"github.com/gofiber/fiber/v2"
)

// GetAllRooms returns a list of unique rooms from ClassTime
// @Summary Get all rooms
// @Description Returns all unique room names from the schedule
// @Tags schedule
// @Produce json
// @Success 200 {object} utils.APIResponse{data=[]string}
// @Failure 500 {object} utils.APIResponse
// @Router /schedule/rooms [get]
func (h *Handler) GetAllRooms(c *fiber.Ctx) error {

	rooms, err := h.Services.GetAllUniqueRooms()
	if err != nil {
		return utils.Error(c, fiber.StatusInternalServerError, err.Error())
	}


	return utils.Success(c, fiber.StatusOK, rooms, "Rooms fetched successfully")
}

type RoomScheduleResponse struct {
	CourseID   uint                      `json:"courseId"`
	CourseName string                    `json:"courseName"`
	Instructor string                    `json:"instructor"`
	Time       []services.ScheduleTimeID `json:"time"`
}

// GetRoomSchedule returns the list of courses scheduled in a specific room
// @Summary Get schedule for a specific room
// @Description Returns the list of courses (with name, instructor, and time slots) that have classes in the given room
// @Tags schedule
// @Param roomID path string true "Room name or room ID"
// @Produce json
// @Success 200 {object} utils.APIResponse{data=[]RoomScheduleResponse}
// @Failure 500 {object} utils.APIResponse
// @Router /schedule/rooms/{roomID} [get]
func (h *Handler) GetRoomSchedule(c *fiber.Ctx) error {
	selectedRoom := c.Params("roomID")

	coursesIDs, err := h.Services.GetRecordsByRoom(selectedRoom)
	if err != nil {
		return utils.Error(c, fiber.StatusInternalServerError, err.Error())
	}

	courses, err := h.Services.GetCoursesSchedule()
	if err != nil {
		return utils.Error(c, fiber.StatusInternalServerError, err.Error())
	}

	courseMap := make(map[uint]services.ScheduleCourse)
	for _, c := range courses {
		courseMap[c.ID] = c
	}

	instructors, _ := h.Services.GetAllInstructorsSchedule()
	times, _ := h.Services.GetAllTimesSchedule()

	instructorMap := make(map[int]services.ScheduleInstructor)
	for _, i := range instructors {
		instructorMap[int(i.ID)] = i
	}

	timeMap := make(map[int][]services.ScheduleTimeID)
	for _, t := range times {
		timeMap[int(t.CourseID)] = append(timeMap[int(t.CourseID)], t)
	}

	var check []uint

	var results []RoomScheduleResponse

	for _, class := range coursesIDs {
		if slices.Contains(check, class.CourseID) {
			continue
		} else {
			check = append(check, class.CourseID)
		}
		course, exists := courseMap[class.CourseID]
		if !exists {
			continue
		}

		instructor := instructorMap[int(course.InstructorID)].Name

		classTime := timeMap[int(course.ID)]

		var filteredTimes []services.ScheduleTimeID
		for _, t := range classTime {
			if t.CourseID == class.CourseID && t.Room == selectedRoom {
				filteredTimes = append(filteredTimes, t)
			}
		}

		results = append(results, RoomScheduleResponse{
			CourseID:   course.ID,
			CourseName: course.Name,
			Instructor: instructor,
			Time:       filteredTimes,
		})
	}

	return utils.Success(c, fiber.StatusOK, results, "Room schedule fetched successfully")
}
