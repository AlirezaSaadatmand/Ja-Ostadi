package handlers

import (
	"path/filepath"
	"strconv"

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

	image, err := h.Services.InsertMealImage(tempPath, filepath.Ext(file.Filename), keywords)
	if err != nil {
		return utils.Error(c, fiber.StatusInternalServerError, err.Error())
	}

	return utils.Success(c, fiber.StatusOK, image.ImageURL, "Meal image uploaded successfully")
}

// UpdateMealImage updates an existing meal's image and/or keywords
// @Summary Update a meal image and keywords
// @Description Updates a meal's image if provided and updates its keywords
// @Tags food
// @Accept multipart/form-data
// @Produce json
// @Param mealId path string true "Meal ID"
// @Param image formData file false "New Meal Image File"
// @Param keywords formData string false "Comma-separated keywords"
// @Param X-Admin-Token header string true "Admin authentication token"
// @Success 200 {object} utils.APIResponse{data}
// @Failure 400 {object} utils.APIResponse
// @Failure 404 {object} utils.APIResponse
// @Failure 500 {object} utils.APIResponse
// @Router /food/{mealId}/image [patch]
func (h *Handler) UpdateMealImage(c *fiber.Ctx) error {
	id := c.Params("mealId")

	mealId, err := strconv.Atoi(id)
	if err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "mealId must be a valid number")
	}

	file, _ := c.FormFile("image")
	keywords := c.FormValue("keywords", "")

	meal, err := h.Services.CheckMealExists(mealId)
	if err != nil {
		return utils.Error(c, fiber.StatusNotFound, "Meal not found")
	}

	var tempPath string
	var ext string
	if file != nil {
		ext = filepath.Ext(file.Filename)
		tempPath = filepath.Join("./tmp", file.Filename)
		if err := c.SaveFile(file, tempPath); err != nil {
			return utils.Error(c, fiber.StatusInternalServerError, "Failed to temporarily store file")
		}
	}

	updatedMeal, err := h.Services.UpdateMealImage(meal, tempPath, ext, keywords)
	if err != nil {
		return utils.Error(c, fiber.StatusInternalServerError, err.Error())
	}

	return utils.Success(c, fiber.StatusOK, updatedMeal, "Meal image and/or keywords updated successfully")
}
