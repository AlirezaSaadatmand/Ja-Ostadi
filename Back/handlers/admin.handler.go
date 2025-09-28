package handlers

import (
	"github.com/AlirezaSaadatmand/Ja-Ostadi/utils"
	"github.com/gofiber/fiber/v2"
)

// UploadJson triggers the scraper to fetch and update data
// @Summary Update course data
// @Description Runs the scraper to fetch the latest course data from the source system (admin only).
// @Tags Admin
// @Accept json
// @Produce json
// @Param X-Admin-Token header string true "Admin authentication token"
// @Success 200 {object} utils.APIResponse "Data updated successfully"
// @Failure 401 {object} utils.APIResponse "Unauthorized: missing or invalid admin token"
// @Failure 500 {object} utils.APIResponse "Internal Server Error"
// @Router /admin/update/data [post]
func (h *Handler) UpdateData(c *fiber.Ctx) error {

	h.Scraper.Scraper()

	return utils.Success(c, fiber.StatusOK, nil, "Data updated successfully")
}
