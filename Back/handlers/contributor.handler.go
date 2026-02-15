package handlers

import (
	"github.com/AlirezaSaadatmand/Ja-Ostadi/utils"
	"github.com/gofiber/fiber/v2"
)

// GetContributors godoc
// @Summary Get contributors
// @Description Get contributors from database
// @Tags Contributors
// @Produce json
// @Success 200 {object} utils.APIResponse
// @Failure 500 {object} utils.APIResponse
// @Router /contributors [get]
func (h *Handler) GetContributors(c *fiber.Ctx) error {


	contributors, err := h.Services.GetContributors()
	if err != nil {
		return utils.Error(c, fiber.StatusInternalServerError, "Failed to fetch contributors")
	}

	return utils.Success(c, fiber.StatusOK, contributors, "Contributors fetched successfully")
}
