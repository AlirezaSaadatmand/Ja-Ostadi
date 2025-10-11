package handlers

import (
	"path/filepath"

	"github.com/AlirezaSaadatmand/Ja-Ostadi/utils"
	"github.com/gofiber/fiber/v2"
)

// UploadMealImage uploads an image and stores metadata
// @Summary Upload a meal image
// @Description Uploads a meal image and saves its record to the database
// @Tags food
// @Accept multipart/form-data
// @Produce json
// @Param image formData file true "Meal Image File"
// @Param X-Admin-Token header string true "Admin authentication token"
// @Param keywords formData string true "Comma-separated keywords for the image"
// @Success 200 {object} utils.APIResponse{data}
// @Failure 400 {object} utils.APIResponse
// @Failure 500 {object} utils.APIResponse
// @Router /food/image [post]
func (h *Handler) UploadMealImage(c *fiber.Ctx) error {
	file, err := c.FormFile("image")
	if err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "Image file is required")
	}

	keywords := c.FormValue("keywords", "")

	tempPath := filepath.Join("./tmp", file.Filename)
	if err := c.SaveFile(file, tempPath); err != nil {
		return utils.Error(c, fiber.StatusInternalServerError, "Failed to temporarily store file")
	}

	image, err := h.Services.SaveMealImage(tempPath, filepath.Ext(file.Filename), keywords)
	if err != nil {
		return utils.Error(c, fiber.StatusInternalServerError, err.Error())
	}

	return utils.Success(c, fiber.StatusOK, image.ImageURL, "Meal image uploaded successfully")
}
