package handlers

import (
	"github.com/AlirezaSaadatmand/Ja-Ostadi/utils"
	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"

)

type CreateCommentRequest struct {
	InstructorID uint   `json:"instructor_id"`
	Content      string `json:"content"`
}

// CreateComment submits a new comment (public, pending moderation)
// @Summary Submit a comment
// @Tags comments
// @Accept json
// @Produce json
// @Param request body CreateCommentRequest true "Comment data"
// @Success 200 {object} utils.APIResponse
// @Failure 400 {object} utils.APIResponse
// @Failure 401 {object} utils.APIResponse
// @Security BearerAuth
// @Router /comments [post]
func (h *Handler) CreateComment(c *fiber.Ctx) error {
	raw := c.Locals("client")
	if raw == nil {
		return utils.Error(c, fiber.StatusUnauthorized, "Client is Unauthenticated")
	}

	claims, ok := raw.(jwt.MapClaims)
	if !ok {
		return utils.Error(c, fiber.StatusUnauthorized, "Invalid client claims")
	}

	clientIDf, ok := claims["clientID"].(float64)
	if !ok || clientIDf == 0 {
		return utils.Error(c, fiber.StatusUnauthorized, "Invalid client ID in token")
	}
	clientID := uint(clientIDf)

	var req CreateCommentRequest
	if err := c.BodyParser(&req); err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "Invalid request body")
	}

	if req.InstructorID < 1 {
		return utils.Error(c, fiber.StatusBadRequest, "Invalid instructor ID")
	}

	if err := h.Services.CreateComment(clientID, req.InstructorID, req.Content, c.IP()); err != nil {
		return utils.Error(c, fiber.StatusBadRequest, err.Error())
	}

	return utils.Success(c, fiber.StatusOK, nil, "Comment submitted and awaiting moderation")
}

// GetComments returns approved comments for an instructor
// @Summary Get approved comments
// @Tags comments
// @Produce json
// @Param instructorID path int true "Instructor ID"
// @Success 200 {object} utils.APIResponse{data=[]services.CommentData}
// @Router /comments/instructor/{instructorID} [get]
func (h *Handler) GetComments(c *fiber.Ctx) error {
	instructorID, err := c.ParamsInt("instructorID")
	if err != nil || instructorID < 1 {
		return utils.Error(c, fiber.StatusBadRequest, "Invalid instructor ID")
	}

	comments, err := h.Services.GetApprovedComments(uint(instructorID))
	if err != nil {
		return utils.Error(c, fiber.StatusInternalServerError, err.Error())
	}

	return utils.Success(c, fiber.StatusOK, comments, "Data fetched successfully")
}