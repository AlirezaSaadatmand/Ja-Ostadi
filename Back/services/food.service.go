package services

import (
	"errors"
	"fmt"
	"os"
	"path/filepath"
	"time"

	"github.com/AlirezaSaadatmand/Ja-Ostadi/database"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/models"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/pkg/logging"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/types"
)


func (s *Services) InsertMealImage(tempFilePath, fileExt, keywords string) (*models.MealImage, error) {
	uploadDir := "./uploads/food"

	if err := os.MkdirAll(uploadDir, os.ModePerm); err != nil {
		s.Logger.Error(logging.General, logging.CreateFile, "Failed to create upload directory",
			map[logging.ExtraKey]interface{}{"error": err.Error()})
		return nil, errors.New("internal error creating upload directory")
	}

	timestamp := time.Now().UnixNano()
	newFileName := fmt.Sprintf("meal_%d%s", timestamp, fileExt)
	finalPath := filepath.Join(uploadDir, newFileName)

	if err := os.Rename(tempFilePath, finalPath); err != nil {
		s.Logger.Error(logging.General, logging.Update, "Failed to move uploaded file",
			map[logging.ExtraKey]interface{}{
				"error": err.Error(),
				"src":   tempFilePath,
				"dst":   finalPath,
			})
		return nil, errors.New("failed to store uploaded image")
	}

	image := models.MealImage{
		ImageURL: fmt.Sprintf("/uploads/food/%s", newFileName),
		Keywords: keywords,
	}

	if err := database.DB.Create(&image).Error; err != nil {
		s.Logger.Error(logging.Mysql, logging.Insert, "Failed to insert meal image record",
			map[logging.ExtraKey]interface{}{
				"error": err.Error(),
				"file":  newFileName,
			})
		return nil, errors.New("failed to save image record in database")
	}

	s.Logger.Info(logging.Mysql, logging.Insert, "Meal image saved successfully",
		map[logging.ExtraKey]interface{}{
			"file": newFileName,
		})

	return &image, nil
}

func (s *Services) SaveMealImage(tempFilePath, fileExt string) (*models.MealImage, error) {
	uploadDir := "./uploads/food"

	if err := os.MkdirAll(uploadDir, os.ModePerm); err != nil {
		s.Logger.Error(logging.General, logging.CreateFile, "Failed to create upload directory",
			map[logging.ExtraKey]interface{}{"error": err.Error()})
		return nil, errors.New("internal error creating upload directory")
	}

	timestamp := time.Now().UnixNano()
	newFileName := fmt.Sprintf("meal_%d%s", timestamp, fileExt)
	fullPath := filepath.Join(uploadDir, newFileName)

	if err := os.Rename(tempFilePath, fullPath); err != nil {
		s.Logger.Error(logging.General, logging.Update, "Failed to move uploaded file",
			map[logging.ExtraKey]interface{}{"error": err.Error(), "src": tempFilePath, "dst": fullPath})
		return nil, errors.New("failed to store uploaded image")
	}

	image := &models.MealImage{
		ImageURL: fmt.Sprintf("/uploads/food/%s", newFileName),
	}

	s.Logger.Info(logging.General, logging.Update, "Meal image file saved successfully",
		map[logging.ExtraKey]interface{}{"file": newFileName})

	return image, nil
}

func (s *Services) CheckMealExists(mealId int) (*models.MealImage, error) {
	var meal *models.MealImage

	if err := database.DB.First(&meal, "id = ?", mealId).Error; err != nil {
		s.Logger.Error(logging.Mysql, logging.Select, "Meal not found", map[logging.ExtraKey]interface{}{
			"meal_id": mealId, "error": err.Error(),
		})
		return meal , errors.New("meal not found")
	}
	return meal , nil
}	

func (s *Services) UpdateMealImage(meal *models.MealImage, tempPath, ext, keywords string) (*models.MealImage, error) {
	updateData := map[string]interface{}{}

	if tempPath != "" {
		if meal.ImageURL != "" {
			fmt.Println(meal.ImageURL)
			if err := os.Remove(meal.ImageURL); err != nil && !os.IsNotExist(err) {
				s.Logger.Error(logging.General, logging.RemoveFile, "Failed to remove old meal image", map[logging.ExtraKey]interface{}{
					"meal_id": meal.ID, "error": err.Error(),
				})
				return nil, fmt.Errorf("failed to remove old image: %v", err)
			}
		}

		image, err := s.SaveMealImage(tempPath, ext)
		if err != nil {
			s.Logger.Error(logging.General, logging.CreateFile, "Failed to save new meal image", map[logging.ExtraKey]interface{}{
				"meal_id": meal.ID, "error": err.Error(),
			})
			return nil, fmt.Errorf("failed to save new image: %v", err)
		}

		updateData["image_url"] = image.ImageURL
	}

	if keywords != "" {
		updateData["keywords"] = keywords
	}

	if len(updateData) == 0 {
		return nil, errors.New("no data to update")
	}

	if err := database.DB.Model(&meal).Updates(updateData).Error; err != nil {
		s.Logger.Error(logging.Mysql, logging.Update, "Failed to update meal", map[logging.ExtraKey]interface{}{
			"meal_id": meal.ID, "error": err.Error(),
		})
		return nil, fmt.Errorf("failed to update meal in database: %v", err)
	}

	if err := database.DB.First(&meal, meal.ID).Error; err != nil {
		return nil, fmt.Errorf("failed to fetch updated meal: %v", err)
	}

	s.Logger.Info(logging.Mysql, logging.Update, "Meal updated successfully", map[logging.ExtraKey]interface{}{
		"meal_id": meal.ID,
	})

	return meal, nil
}

func (s *Services) GetLastWeekMeals() (*models.WeekMeals, error) {
	var lastWeek models.WeekMeals

	if err := database.DB.Preload("Meals").Last(&lastWeek).Error; err != nil {
		s.Logger.Error(logging.Mysql, logging.Select, "Failed to fetch last week meals", map[logging.ExtraKey]interface{}{
			"error": err.Error(),
		})
		return nil, errors.New("no week meals found")
	}

	return &lastWeek, nil
}

func (s *Services) GetDaysByWeekID(weekId int) ([]models.DayMeals, error) {
	var days []models.DayMeals

	if err := database.DB.
		Preload("Meals").
		Where("week_id = ?", weekId).
		Find(&days).Error; err != nil {
		s.Logger.Error(logging.Mysql, logging.Select, "Failed to fetch days by week ID", map[logging.ExtraKey]interface{}{
			"week_id": weekId,
			"error":   err.Error(),
		})
		return nil, errors.New("failed to fetch days for the given week")
	}

	if len(days) == 0 {
		s.Logger.Warn(logging.Mysql, logging.Select, "No days found for the given week", map[logging.ExtraKey]interface{}{
			"week_id": weekId,
		})
		return nil, errors.New("no days found for this week")
	}

	return days, nil
}

func (s *Services) GetMealsByDayID(dayId int) ([]models.Meal, error) {
	var meals []models.Meal

	if err := database.DB.
		Preload("Image").
		Where("day_id = ?", dayId).
		Find(&meals).Error; err != nil {
		s.Logger.Error(logging.Mysql, logging.Select, "Failed to fetch meals by day ID", map[logging.ExtraKey]interface{}{
			"day_id": dayId,
			"error":  err.Error(),
		})
		return nil, errors.New("failed to fetch meals for the given day")
	}

	return meals, nil
}

func (s *Services) SubmitOrUpdateRating(userID uint, req types.SubmitRatingRequest) (*models.RateMeal, error) {
	var existing models.RateMeal

	result := database.DB.Where("user_id = ? AND meal_id = ?", userID, req.MealID).First(&existing)
	if result.Error == nil {
		existing.Rating = req.Rating
		existing.Comment = req.Comment

		if err := database.DB.Save(&existing).Error; err != nil {
			s.Logger.Error(logging.Mysql, logging.Update, "Failed to update rating", map[logging.ExtraKey]interface{}{
				"user_id": userID, "meal_id": req.MealID, "error": err.Error(),
			})
			return nil, errors.New("failed to update rating")
		}

		return &existing, nil
	}

	newRating := models.RateMeal{
		UserId:  uint(userID),
		MealId:  uint(req.MealID),
		Rating:  req.Rating,
		Comment: req.Comment,
	}

	if err := database.DB.Create(&newRating).Error; err != nil {
		s.Logger.Error(logging.Mysql, logging.Insert, "Failed to create rating", map[logging.ExtraKey]interface{}{
			"user_id": userID, "meal_id": req.MealID, "error": err.Error(),
		})
		return nil, errors.New("failed to save rating")
	}

	return &newRating, nil
}
