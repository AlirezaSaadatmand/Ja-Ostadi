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

)

func (s *Services) SaveMealImage(tempFilePath, fileExt, keywords string) (*models.MealImage, error) {
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

	image := models.MealImage{
		ImageURL: fmt.Sprintf("/uploads/food/%s", newFileName),
		Keywords: keywords,
	}

	err := database.DB.Create(&image).Error
	if err != nil {
		s.Logger.Error(logging.Mysql, logging.Insert, "Failed to insert meal image record",
			map[logging.ExtraKey]interface{}{"error": err.Error(), "file": newFileName})
		return nil, errors.New("failed to save image record in database")
	}

	s.Logger.Info(logging.Mysql, logging.Insert, "Meal image saved successfully",
		map[logging.ExtraKey]interface{}{"file": newFileName})

	return &image, nil
}
