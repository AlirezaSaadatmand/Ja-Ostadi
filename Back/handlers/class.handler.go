package handlers

import (
	"github.com/AlirezaSaadatmand/Ja-Ostadi/utils"
	"github.com/gofiber/fiber/v2"
)

func doesExists(class string, classes []string) bool {
	for _, c := range classes {
		if class == c {
			return true
		}
	}
	return false
}

// GetAllRooms returns a list of unique rooms from ClassTime
// @Summary Get all rooms
// @Description Returns all unique room names from the schedule
// @Tags schedule
// @Produce json
// @Success 200 {object} utils.APIResponse{data=[]string}
// @Failure 500 {object} utils.APIResponse
// @Router /schedule/rooms [get]
func (h *Handler) GetAllRooms(c *fiber.Ctx) error {

	courses, err := h.Services.GetCoursesSchedule()
	if err != nil {
		return utils.Error(c, fiber.StatusInternalServerError, err.Error())
	}

	var courseId []uint
	for _, course := range courses {
		courseId = append(courseId, course.ID)
	}

	rooms, err := h.Services.GetAllUniqueRooms()
	if err != nil {
		return utils.Error(c, fiber.StatusInternalServerError, err.Error())
	}

	var thisSemesterRooms []string

	for _, class := range rooms {
		for _, id := range courseId {
			if class.CourseID == id && !doesExists(class.Room, thisSemesterRooms) {
				thisSemesterRooms = append(thisSemesterRooms, class.Room)
				break
			}
		}
	}

	return utils.Success(c, fiber.StatusOK, thisSemesterRooms, "Rooms fetched successfully")
}
