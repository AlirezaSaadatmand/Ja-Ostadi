package services

import (
	"errors"

	"github.com/AlirezaSaadatmand/Ja-Ostadi/database"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/models"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/pkg/logging"
	"gorm.io/gorm"
)

func (s *Services) CreateDepartmentDirector(director *models.DepartmentDirector) error {
	var existingDirector models.DepartmentDirector
	err := database.DB.Where("username = ?", director.Username).First(&existingDirector).Error
	if err == nil {
		return errors.New("username already exists")
	}
	if err != nil && err != gorm.ErrRecordNotFound {
		s.Logger.Error(logging.Mysql, logging.Select, "Failed to check existing director", map[logging.ExtraKey]interface{}{
			"username": director.Username,
			"error":    err.Error(),
		})
		return errors.New("database error")
	}

	err = database.DB.Create(director).Error
	if err != nil {
		s.Logger.Error(logging.Mysql, logging.Insert, "Failed to create department director", map[logging.ExtraKey]interface{}{
			"username": director.Username,
			"error":    err.Error(),
		})
		return errors.New("failed to create director")
	}

	s.Logger.Info(logging.Mysql, logging.Insert, "Department director created successfully", map[logging.ExtraKey]interface{}{
		"directorID": director.ID,
		"username":   director.Username,
	})

	return nil
}
