package handlers

import (
	"github.com/AlirezaSaadatmand/Ja-Ostadi/types"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/utils"
	"github.com/gofiber/fiber/v2"
)

// CreateTempCourse creates a new temporary course
// @Summary Create temp course
// @Description Create a new temporary course
// @Tags TempCourses
// @Accept json
// @Produce json
// @Param Authorization header string true "Bearer {token}"
// @Param body body types.TempCourseRequest true "Temp course data"
// @Success 201 {object} utils.APIResponse{data=types.TempCourseRequest} "Temp course created"
// @Failure 400 {object} utils.APIResponse "Bad Request: invalid input"
// @Failure 401 {object} utils.APIResponse "Unauthorized"
// @Failure 500 {object} utils.APIResponse "Internal Server Error"
// @Router /directors/temp-courses [post]
func (h *Handler) CreateTempCourse(c *fiber.Ctx) error {
	directorID, ok := c.Locals("directorID").(string)
	if !ok || directorID == "" {
		return utils.Error(c, fiber.StatusUnauthorized, "Unauthorized")
	}

	var req types.TempCourseRequest
	if err := c.BodyParser(&req); err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "Invalid request body")
	}

	tempCourse, err := h.Services.CreateTempCourse(directorID, req)
	if err != nil {
		return utils.Error(c, fiber.StatusInternalServerError, err.Error())
	}

	return utils.Success(c, fiber.StatusCreated, tempCourse, "Temp course created successfully")
}
