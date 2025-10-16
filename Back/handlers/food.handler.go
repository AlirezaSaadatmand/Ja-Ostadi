package handlers

import (
	"path/filepath"
	"strconv"
	"strings"

	"github.com/AlirezaSaadatmand/Ja-Ostadi/types"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/utils"
	"github.com/gofiber/fiber/v2"
)

// GetWeeklyFood retrieves the current week's meal schedule
// @Summary Get weekly food schedule
// @Description Returns the most recent week's food plan, including all days and their respective breakfast, lunch, and dinner meals.
// @Tags food
// @Accept json
// @Produce json
// @Success 200 {object} utils.APIResponse{data=types.FoodData}
// @Failure 500 {object} utils.APIResponse
// @Router /food/weekly [get]
func (h *Handler) GetWeeklyFood(c *fiber.Ctx) error {
	var data types.FoodData

	week, err := h.Services.GetLastWeekMeals()
	if err != nil {
		return utils.Error(c, fiber.StatusInternalServerError, err.Error())
	}

	data.Week = week.Week

	days, err := h.Services.GetDaysByWeekID(int(week.ID))
	if err != nil {
		return utils.Error(c, fiber.StatusInternalServerError, err.Error())
	}

	for _, day := range days {
		var dayFood types.DayFoodData
		dayFood.Day = day.Day
		dayFood.Date = day.Date

		meals, err := h.Services.GetMealsByDayID(int(day.ID))
		if err != nil {
			return utils.Error(c, fiber.StatusInternalServerError, err.Error())
		}

		for _, meal := range meals {
			m := types.MealData{
				Name:        meal.Name,
				Price:       meal.Price,
				Rating:      float32(meal.Rating),
				Description: meal.Description,
				Place:       meal.Place,
			}

			// if meal.Image != nil {
			// 	m.ImageAddress = meal.Image.URL // change field name if needed (e.g. `meal.Image.Address`)
			// }

			switch strings.ToLower(meal.Type) {
			case "breakfast":
				dayFood.Breakfast = append(dayFood.Breakfast, m)
			case "lunch":
				dayFood.Lunch = append(dayFood.Lunch, m)
			case "dinner":
				dayFood.Dinner = append(dayFood.Dinner, m)
			}
		}

		data.Meals = append(data.Meals, dayFood)
	}

	return utils.Success(c, fiber.StatusOK, data, "Meal image uploaded successfully")

}

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


