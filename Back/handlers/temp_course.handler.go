package handlers

import (
	"strconv"

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
// @Router /temp-courses [post]
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

	return utils.Success(c, fiber.StatusCreated, tempCourse, "TempCourse created successfully")
}

// UpdateTempCourse updates a temp course
// @Summary Update temp course
// @Description Update an existing temporary course
// @Tags TempCourses
// @Accept json
// @Produce json
// @Param Authorization header string true "Bearer {token}"
// @Param id path int true "Temp Course ID"
// @Param body body types.TempCourseUpdateRequest true "Temp course update data"
// @Success 200 {object} utils.APIResponse{data=types.TempCourseUpdateRequest} "Temp course updated"
// @Failure 400 {object} utils.APIResponse "Bad Request: invalid input"
// @Failure 401 {object} utils.APIResponse "Unauthorized"
// @Failure 404 {object} utils.APIResponse "Not Found"
// @Failure 500 {object} utils.APIResponse "Internal Server Error"
// @Router /temp-courses/{id} [patch]
func (h *Handler) UpdateTempCourse(c *fiber.Ctx) error {
	directorID, ok := c.Locals("directorID").(string)
	if !ok || directorID == "" {
		return utils.Error(c, fiber.StatusUnauthorized, "Unauthorized")
	}

	id, err := strconv.ParseUint(c.Params("id"), 10, 32)
	if err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "Invalid temp course ID")
	}

	var req types.TempCourseUpdateRequest
	if err := c.BodyParser(&req); err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "Invalid request body")
	}

	tempCourse, err := h.Services.UpdateTempCourse(directorID, uint(id), req)
	if err != nil {
		if err.Error() == "temp course not found" {
			return utils.Error(c, fiber.StatusNotFound, "Temp course not found")
		}
		return utils.Error(c, fiber.StatusInternalServerError, err.Error())
	}

	return utils.Success(c, fiber.StatusOK, tempCourse, "Temp course updated successfully")
}


// DeleteTempCourse deletes a temp course
// @Summary Delete temp course
// @Description Delete a temporary course
// @Tags TempCourses
// @Accept json
// @Produce json
// @Param Authorization header string true "Bearer {token}"
// @Param id path int true "Temp Course ID"
// @Success 200 {object} utils.APIResponse "Temp course deleted"
// @Failure 400 {object} utils.APIResponse "Bad Request: invalid ID"
// @Failure 401 {object} utils.APIResponse "Unauthorized"
// @Failure 404 {object} utils.APIResponse "Not Found"
// @Failure 500 {object} utils.APIResponse "Internal Server Error"
// @Router /temp-courses/{id} [delete]
func (h *Handler) DeleteTempCourse(c *fiber.Ctx) error {
	directorID, ok := c.Locals("directorID").(string)
	if !ok || directorID == "" {
		return utils.Error(c, fiber.StatusUnauthorized, "Unauthorized")
	}

	id, err := strconv.ParseUint(c.Params("id"), 10, 32)
	if err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "Invalid temp course ID")
	}

	err = h.Services.DeleteTempCourse(directorID, uint(id))
	if err != nil {
		if err.Error() == "temp course not found" {
			return utils.Error(c, fiber.StatusNotFound, "Temp course not found")
		}
		return utils.Error(c, fiber.StatusInternalServerError, err.Error())
	}

	return utils.Success(c, fiber.StatusOK, nil, "Temp course deleted successfully")
}

// GetTempCourses retrieves all temp courses with filtering
// @Summary Get temp courses
// @Description Retrieve all temporary courses with optional filtering
// @Tags TempCourses
// @Accept json
// @Produce json
// @Param Authorization header string true "Bearer {token}"
// @Param instructor query string false "Instructor filter"
// @Success 200 {object} utils.APIResponse{} "Temp courses retrieved"
// @Failure 400 {object} utils.APIResponse "Bad Request: invalid query"
// @Failure 401 {object} utils.APIResponse "Unauthorized"
// @Failure 500 {object} utils.APIResponse "Internal Server Error"
// @Router /temp-courses [get]
func (h *Handler) GetTempCourses(c *fiber.Ctx) error {
	directorID, ok := c.Locals("directorID").(string)
	if !ok || directorID == "" {
		return utils.Error(c, fiber.StatusUnauthorized, "Unauthorized")
	}

	tempCourses, err := h.Services.GetTempCourses(directorID)
	if err != nil {
		return utils.Error(c, fiber.StatusInternalServerError, err.Error())
	}


	return utils.Success(c, fiber.StatusOK, tempCourses, "Temp courses retrieved successfully")
}