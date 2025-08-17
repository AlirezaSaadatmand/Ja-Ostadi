package handlers

import (
	"github.com/AlirezaSaadatmand/Ja-Ostadi/utils"
	"github.com/gofiber/fiber/v2"
)

// GetSemesters returns the list of all semesters
// @Summary Get semesters
// @Description Returns all semesters
// @Tags semesters
// @Produce json
// @Success 200 {object} utils.APIResponse{data=[]services.SemesterData}
// @Failure 500 {object} utils.APIResponse
// @Router /semesters/ [get]
func (h *Handler) GetSemesters(c *fiber.Ctx) error {
	semesters, err := h.Services.GetSemesters()
	if err != nil {
		return utils.Error(c, fiber.StatusInternalServerError, err.Error())
	}

	return utils.Success(c, fiber.StatusOK, semesters, "Data fetched successfully")
}
