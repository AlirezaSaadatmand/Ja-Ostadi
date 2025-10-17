package handlers

import (
	"path/filepath"
	"strconv"
	"strings"

	"github.com/AlirezaSaadatmand/Ja-Ostadi/scripts"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/types"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/utils"
	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
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
				ID:          strconv.Itoa(int(meal.ID)),
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

// GetNewData godoc
// @Summary Receive new food data and parse it
// @Description Accepts JSON data containing week meals and sends it to the parser service
// @Tags food
// @Accept json
// @Produce json
// @Param data body types.FoodData true "Weekly food data JSON"
// @Success 200 {object} utils.APIResponse{data}
// @Failure 400 {object} utils.APIResponse
// @Failure 500 {object} utils.APIResponse
// @Router /food/weekly [post]
func (h *Handler) GetNewData(c *fiber.Ctx) error {
	var foodData types.FoodData

	// Parse JSON body into FoodData struct
	if err := c.BodyParser(&foodData); err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "Invalid JSON body: "+err.Error())
	}

	// Pass parsed data to your parser service
	if _, err := scripts.ParseAndUpdateFoodWeek(c.Body()); err != nil {
		return utils.Error(c, fiber.StatusInternalServerError, "Failed to parse data: "+err.Error())
	}

	// Respond success
	return utils.Success(c, fiber.StatusOK, nil, "Meal image and/or keywords updated successfully")

}

// SubmitRating godoc
// @Summary Submit or update a meal rating
// @Description Allows a user to rate a meal (0–5 stars) and leave an optional comment
// @Tags food
// @Accept json
// @Produce json
// @Param data body services.SubmitRatingRequest true "Meal rating data"
// @Success 200 {object} utils.APIResponse{data}
// @Failure 400 {object} utils.APIResponse
// @Failure 500 {object} utils.APIResponse
// @Router /food/rate [post]
func (h *Handler) SubmitRating(c *fiber.Ctx) error {
	userClaims := c.Locals("user").(jwt.MapClaims)
	userIDFloat, ok := userClaims["user_id"].(float64)
	if !ok {
		return utils.Error(c, fiber.StatusBadRequest, "Invalid user_id in claims")
	}
	userID := uint(userIDFloat)

	var body types.SubmitRatingRequest
	if err := c.BodyParser(&body); err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "Invalid JSON body: "+err.Error())
	}

	if body.MealID == 0 || body.Rating < 0 || body.Rating > 5 {
		return utils.Error(c, fiber.StatusBadRequest, "Meal ID and valid rating (0–5) are required")
	}

	rating, err := h.Services.SubmitOrUpdateRating(userID, body)
	if err != nil {
		return utils.Error(c, fiber.StatusInternalServerError, err.Error())
	}

	return utils.Success(c, fiber.StatusOK, rating, "Rating submitted successfully")
}
