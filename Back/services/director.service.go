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

func (s *Services) UpdateDepartmentDirector(id uint, updateData *models.DepartmentDirector) (*models.DepartmentDirector, error) {

	var director models.DepartmentDirector
	err := database.DB.First(&director, id).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			s.Logger.Warn(logging.Mysql, logging.Select, "Department director not found for update", map[logging.ExtraKey]interface{}{
				"directorID": id,
			})
			return nil, errors.New("director not found")
		}
		s.Logger.Error(logging.Mysql, logging.Select, "Failed to find department director", map[logging.ExtraKey]interface{}{
			"directorID": id,
			"error":      err.Error(),
		})
		return nil, errors.New("database error")
	}

	if updateData.Username != "" && updateData.Username != director.Username {
		var existingDirector models.DepartmentDirector
		err := database.DB.Where("username = ?", updateData.Username).First(&existingDirector).Error
		if err == nil {
			s.Logger.Warn(logging.Mysql, logging.Select, "Username already exists", map[logging.ExtraKey]interface{}{
				"username": updateData.Username,
			})
			return nil, errors.New("username already exists")
		}
		if err != nil && err != gorm.ErrRecordNotFound {
			s.Logger.Error(logging.Mysql, logging.Select, "Failed to check existing username", map[logging.ExtraKey]interface{}{
				"username": updateData.Username,
				"error":    err.Error(),
			})
			return nil, errors.New("database error")
		}

		director.Username = updateData.Username
	}

	if updateData.Password != "" {
		director.Password = updateData.Password
	}

	err = database.DB.Save(&director).Error
	if err != nil {
		s.Logger.Error(logging.Mysql, logging.Update, "Failed to update department director", map[logging.ExtraKey]interface{}{
			"directorID": id,
			"error":      err.Error(),
		})
		return nil, errors.New("failed to update director")
	}

	s.Logger.Info(logging.Mysql, logging.Update, "Department director updated successfully", map[logging.ExtraKey]interface{}{
		"directorID": id,
		"username":   director.Username,
	})

	return &director, nil
}