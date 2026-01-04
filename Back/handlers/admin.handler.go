package handlers

import (
	"encoding/json"
	"fmt"
	"io"

	"github.com/AlirezaSaadatmand/Ja-Ostadi/models"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/pkg/hashing"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/scripts"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/types"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/utils"
	"github.com/gofiber/fiber/v2"
)

// UploadJson uploads and parses a data file
// @Summary Upload data file
// @Description Accepts a JSON data file upload (admin only), parses it, and returns the number of records
// @Tags Admin
// @Accept multipart/form-data
// @Produce json
// @Param X-Admin-Token header string true "Admin authentication token"
// @Param file formData file true "Data file to upload (JSON format)"
// @Success 200 {object} utils.APIResponse{data=map[string]int} "Example: {\"count\": 42}"
// @Failure 400 {object} utils.APIResponse "Bad Request: missing or invalid file"
// @Failure 401 {object} utils.APIResponse "Unauthorized: missing or invalid admin token"
// @Failure 500 {object} utils.APIResponse "Internal Server Error"
// @Router /admin/update/data [post]
func (h *Handler) UploadJson(c *fiber.Ctx) error {
	fileHeader, err := c.FormFile("file")
	if err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "File is required")
	}

	file, err := fileHeader.Open()
	if err != nil {
		return err
	}
	defer file.Close()

	bytes, err := io.ReadAll(file)
	if err != nil {
		return err
	}

	var data []types.CourseJSON
	if err := json.Unmarshal(bytes, &data); err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "Invalid JSON file")
	}

	dataMap := make(map[string]types.CourseJSON)
	for _, i := range data {
		key := fmt.Sprintf("%s-%s", i.CourseNumber, i.Group)
		dataMap[key] = i
	}

	scripts.SaveData(data)

	if err := scripts.CleanUpCourses("اول - 1404", dataMap); err != nil {
		return utils.Error(c, fiber.StatusInternalServerError, err.Error())
	}

	return utils.Success(c, fiber.StatusOK, fiber.Map{"count": len(data)}, "JSON file uploaded successfully")
}

type DirectorResponse struct {
	ID       uint   `json:"id"`
	Username string `json:"username"`
}

// RegisterDirector registers a new department director (admin only)
// @Summary Register department director
// @Description Create a new department director account (admin only)
// @Tags Admin
// @Accept json
// @Produce json
// @Param X-Admin-Token header string true "Admin authentication token"
// @Param body body types.RegisterDirectorRequest true "Director registration data"
// @Success 201 {object} utils.APIResponse{data=DirectorResponse} "Director created successfully"
// @Failure 400 {object} utils.APIResponse "Bad Request: invalid input"
// @Failure 401 {object} utils.APIResponse "Unauthorized: missing or invalid admin token"
// @Failure 409 {object} utils.APIResponse "Conflict: username already exists"
// @Failure 500 {object} utils.APIResponse "Internal Server Error"
// @Router /admin/directors [post]
func (h *Handler) RegisterDirector(c *fiber.Ctx) error {
	var req types.RegisterDirectorRequest
	if err := c.BodyParser(&req); err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "Invalid request body")
	}

	if req.Username == "" || req.Password == "" {
		return utils.Error(c, fiber.StatusBadRequest, "Username and password are required")
	}

	hashedPassword, err := hashing.HashPassword(req.Password)
	if err != nil {
		return utils.Error(c, fiber.StatusInternalServerError, err.Error())
	}

	director := models.DepartmentDirector{
		Username: req.Username,
		Password: hashedPassword,
	}

	err = h.Services.CreateDepartmentDirector(&director)
	if err != nil {
		if err.Error() == "username already exists" {
			return utils.Error(c, fiber.StatusConflict, "Username already exists")
		}
		return utils.Error(c, fiber.StatusInternalServerError, "Failed to create director")
	}

	response := DirectorResponse{
		ID:       director.ID,
		Username: director.Username,
	}

	return utils.Success(c, fiber.StatusCreated, response, "Department director registered successfully")
}

// UpdateDirector updates a department director's information (admin only)
// @Summary Update department director
// @Description Update a department director's information (admin only)
// @Tags Admin
// @Accept json
// @Produce json
// @Param X-Admin-Token header string true "Admin authentication token"
// @Param id path int true "Director ID"
// @Param body body types.UpdateDirectorRequest true "Director update data"
// @Success 200 {object} utils.APIResponse{data=DirectorResponse} "Director updated successfully"
// @Failure 400 {object} utils.APIResponse "Bad Request: invalid input"
// @Failure 401 {object} utils.APIResponse "Unauthorized: missing or invalid admin token"
// @Failure 404 {object} utils.APIResponse "Not Found: director not found"
// @Failure 409 {object} utils.APIResponse "Conflict: username already exists"
// @Failure 500 {object} utils.APIResponse "Internal Server Error"
// @Router /admin/directors/{id} [put]
func (h *Handler) UpdateDirector(c *fiber.Ctx) error {
	id, err := c.ParamsInt("id")
	if err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "Invalid director ID")
	}

	var req types.UpdateDirectorRequest
	if err := c.BodyParser(&req); err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "Invalid request body")
	}

	if req.Username == "" && req.Password == "" {
		return utils.Error(c, fiber.StatusBadRequest, "At least one field (username or password) must be provided")
	}

	updateData := models.DepartmentDirector{
		Username: req.Username,
	}

	if req.Password != "" {
		hashedPassword, err := hashing.HashPassword(req.Password)
		if err != nil {
			return utils.Error(c, fiber.StatusInternalServerError, err.Error())
		}
		updateData.Password = hashedPassword
	}

	updatedDirector, err := h.Services.UpdateDepartmentDirector(uint(id), &updateData)
	if err != nil {
		switch err.Error() {
		case "director not found":
			return utils.Error(c, fiber.StatusNotFound, "Director not found")
		case "username already exists":
			return utils.Error(c, fiber.StatusConflict, "Username already exists")
		default:
			return utils.Error(c, fiber.StatusInternalServerError, "Failed to update director")
		}
	}

	response := DirectorResponse{
		ID:       updatedDirector.ID,
		Username: updatedDirector.Username,
	}

	return utils.Success(c, fiber.StatusOK, response, "Director updated successfully")
}
