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

	var semester string

	dataMap := make(map[string]types.CourseJSON)
	for _, i := range data {
		key := fmt.Sprintf("%s-%s", i.CourseNumber, i.Group)
		dataMap[key] = i
		semester = i.Semester
	}

	scripts.SaveData(data)

	if err := scripts.CleanUpCourses(semester, dataMap); err != nil {
		return utils.Error(c, fiber.StatusInternalServerError, err.Error())
	}

	return utils.Success(c, fiber.StatusOK, fiber.Map{"count": len(data)}, "JSON file uploaded successfully")
}

type ClientResponse struct {
	ID       uint   `json:"id"`
	Username string `json:"username"`
	Role     string `json:"role"`
}

// RegisterClient registers a new client (admin only)
// @Summary Register client
// @Description Create a new client account (admin only)
// @Tags Admin
// @Accept json
// @Produce json
// @Param X-Admin-Token header string true "Admin authentication token"
// @Param body body types.RegisterClientRequest true "Client registration data"
// @Success 201 {object} utils.APIResponse{data=ClientResponse} "Client created successfully"
// @Failure 400 {object} utils.APIResponse "Bad Request: invalid input"
// @Failure 401 {object} utils.APIResponse "Unauthorized: missing or invalid admin token"
// @Failure 409 {object} utils.APIResponse "Conflict: username already exists"
// @Failure 500 {object} utils.APIResponse "Internal Server Error"
// @Router /admin/clients [post]
func (h *Handler) RegisterClient(c *fiber.Ctx) error {
	var req types.RegisterClientRequest
	if err := c.BodyParser(&req); err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "Invalid request body")
	}

	if req.Username == "" || req.Password == "" || req.Role == "" {
		return utils.Error(c, fiber.StatusBadRequest, "Username and password and role are required")
	}

	hashedPassword, err := hashing.HashPassword(req.Password)
	if err != nil {
		return utils.Error(c, fiber.StatusInternalServerError, err.Error())
	}

	client := models.Client{
		Username: req.Username,
		Password: hashedPassword,
		Role:     req.Role,
	}

	err = h.Services.CreateClient(&client)
	if err != nil {
		if err.Error() == "username already exists" {
			return utils.Error(c, fiber.StatusConflict, "Username already exists")
		}
		return utils.Error(c, fiber.StatusInternalServerError, "Failed to create client")
	}

	response := ClientResponse{
		ID:       client.ID,
		Username: client.Username,
		Role:     client.Role,
	}

	return utils.Success(c, fiber.StatusCreated, response, "Department client registered successfully")
}

// UpdateClient updates a client's information (admin only)
// @Summary Update client
// @Description Update a client's information (admin only)
// @Tags Admin
// @Accept json
// @Produce json
// @Param X-Admin-Token header string true "Admin authentication token"
// @Param id path int true "Client ID"
// @Param body body types.UpdateClientRequest true "Client update data"
// @Success 200 {object} utils.APIResponse{data=ClientResponse} "Client updated successfully"
// @Failure 400 {object} utils.APIResponse "Bad Request: invalid input"
// @Failure 401 {object} utils.APIResponse "Unauthorized: missing or invalid admin token"
// @Failure 404 {object} utils.APIResponse "Not Found: client not found"
// @Failure 409 {object} utils.APIResponse "Conflict: username already exists"
// @Failure 500 {object} utils.APIResponse "Internal Server Error"
// @Router /admin/clients/{id} [patch]
func (h *Handler) UpdateClient(c *fiber.Ctx) error {
	id, err := c.ParamsInt("id")
	if err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "Invalid client ID")
	}

	var req types.UpdateClientRequest
	if err := c.BodyParser(&req); err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "Invalid request body")
	}

	if req.Username == "" && req.Password == "" && req.Role == "" {
		return utils.Error(c, fiber.StatusBadRequest, "At least one field (username or password) must be provided")
	}

	updateData := models.Client{
		Username: req.Username,
		Role:     req.Role,
	}

	if req.Password != "" {
		hashedPassword, err := hashing.HashPassword(req.Password)
		if err != nil {
			return utils.Error(c, fiber.StatusInternalServerError, err.Error())
		}
		updateData.Password = hashedPassword
	}

	updatedClient, err := h.Services.UpdateClient(uint(id), &updateData)
	if err != nil {
		switch err.Error() {
		case "client not found":
			return utils.Error(c, fiber.StatusNotFound, "Client not found")
		case "username already exists":
			return utils.Error(c, fiber.StatusConflict, "Username already exists")
		default:
			return utils.Error(c, fiber.StatusInternalServerError, "Failed to update client")
		}
	}

	response := ClientResponse{
		ID:       updatedClient.ID,
		Username: updatedClient.Username,
		Role:     updatedClient.Role,
	}

	return utils.Success(c, fiber.StatusOK, response, "Client updated successfully")
}

// DeleteClient deletes a client (admin only)
// @Summary Delete client
// @Description Delete a client account (admin only)
// @Tags Admin
// @Produce json
// @Param X-Admin-Token header string true "Admin authentication token"
// @Param id path int true "Client ID"
// @Success 200 {object} utils.APIResponse "Client deleted successfully"
// @Failure 400 {object} utils.APIResponse "Bad Request: invalid ID"
// @Failure 401 {object} utils.APIResponse "Unauthorized: missing or invalid admin token"
// @Failure 404 {object} utils.APIResponse "Not Found: client not found"
// @Failure 500 {object} utils.APIResponse "Internal Server Error"
// @Router /admin/clients/{id} [delete]
func (h *Handler) DeleteClient(c *fiber.Ctx) error {
	id, err := c.ParamsInt("id")
	if err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "Invalid client ID")
	}

	err = h.Services.DeleteClient(uint(id))
	if err != nil {
		if err.Error() == "client not found" {
			return utils.Error(c, fiber.StatusNotFound, "client not found")
		}
		return utils.Error(c, fiber.StatusInternalServerError, "Failed to delete client")
	}

	return utils.Success(c, fiber.StatusOK, nil, "client deleted successfully")
}

// UpdateContributors godoc
// @Summary Update contributors
// @Description Fetch contributors from GitHub and update database (admin only)
// @Tags Admin
// @Produce json
// @Param X-Admin-Token header string true "Admin authentication token"
// @Success 200 {object} utils.APIResponse
// @Failure 401 {object} utils.APIResponse
// @Failure 500 {object} utils.APIResponse
// @Router /admin/update/contributors [post]
func (h *Handler) UpdateContributors(c *fiber.Ctx) error {

	err := h.Services.UpdateContributors()
	if err != nil {
		return utils.Error(c, fiber.StatusInternalServerError, "Failed to update contributors")
	}

	return utils.Success(c, fiber.StatusOK, nil, "Contributors updated successfully")
}
