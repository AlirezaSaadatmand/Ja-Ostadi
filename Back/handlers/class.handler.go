package handlers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/utils"
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
