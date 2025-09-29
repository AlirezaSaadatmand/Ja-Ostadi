package handlers

import (
	"encoding/json"
	"io"

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

	scripts.SaveData(data)

	return utils.Success(c, fiber.StatusOK, fiber.Map{"count": len(data)}, "JSON file uploaded successfully")
}
