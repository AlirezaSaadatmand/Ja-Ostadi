package handlers

import (
	"github.com/AlirezaSaadatmand/Ja-Ostadi/utils"
	"github.com/gofiber/fiber/v2"
)

// AdminGetComments lists comments with optional status filter and pagination
// @Summary List comments (admin)
// @Tags Admin
// @Produce json
// @Param status query string false "pending|approved|rejected"
// @Param page query int false "Page number"
// @Param limit query int false "Items per page"
// @Success 200 {object} utils.APIResponse
// @Router /admin/comments [get]
func (h *Handler) AdminGetComments(c *fiber.Ctx) error {
	status := c.Query("status")
	page := c.QueryInt("page", 1)
	limit := c.QueryInt("limit", 20)

	comments, total, err := h.Services.AdminGetComments(status, page, limit)
	if err != nil {
		return utils.Error(c, fiber.StatusInternalServerError, err.Error())
	}

	return utils.Success(c, fiber.StatusOK, fiber.Map{
		"comments": comments,
		"total":    total,
		"page":     page,
		"limit":    limit,
	}, "Data fetched successfully")
}

// AdminUpdateCommentStatus approves or rejects a comment
// @Summary Update comment status (admin)
// @Tags Admin
// @Accept json
// @Produce json
// @Param id path int true "Comment ID"
// @Success 200 {object} utils.APIResponse
// @Router /admin/comments/{id}/status [patch]
func (h *Handler) AdminUpdateCommentStatus(c *fiber.Ctx) error {
	id, err := c.ParamsInt("id")
	if err != nil || id < 1 {
		return utils.Error(c, fiber.StatusBadRequest, "Invalid comment ID")
	}

	var body struct {
		Status string `json:"status"`
	}
	if err := c.BodyParser(&body); err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "Invalid request body")
	}

	if err := h.Services.AdminUpdateCommentStatus(uint(id), body.Status); err != nil {
		return utils.Error(c, fiber.StatusBadRequest, err.Error())
	}

	return utils.Success(c, fiber.StatusOK, nil, "Comment updated successfully")
}

// AdminDeleteComment soft-deletes a comment
// @Summary Delete comment (admin)
// @Tags Admin
// @Produce json
// @Param id path int true "Comment ID"
// @Success 200 {object} utils.APIResponse
// @Router /admin/comments/{id} [delete]
func (h *Handler) AdminDeleteComment(c *fiber.Ctx) error {
	id, err := c.ParamsInt("id")
	if err != nil || id < 1 {
		return utils.Error(c, fiber.StatusBadRequest, "Invalid comment ID")
	}

	if err := h.Services.AdminDeleteComment(uint(id)); err != nil {
		return utils.Error(c, fiber.StatusBadRequest, err.Error())
	}

	return utils.Success(c, fiber.StatusOK, nil, "Comment deleted successfully")
}
