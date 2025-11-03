package services

import (
	"errors"

	"github.com/AlirezaSaadatmand/Ja-Ostadi/database"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/models"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/pkg/logging"
)

func (s *Services) GetAllUniqueRooms() ([]string, error) {
	var rooms []string

	err := database.DB.
		Model(&models.ClassTime{}).
		Distinct("room").
		Pluck("room", &rooms).Error

	if err != nil {
		s.Logger.Error(logging.Mysql, logging.Select, "Failed to get unique rooms", map[logging.ExtraKey]interface{}{
			"error": err.Error(),
		})
		return nil, errors.New("error getting rooms")
	}

	s.Logger.Info(logging.Mysql, logging.Select, "Fetched unique rooms successfully", map[logging.ExtraKey]interface{}{
		"count": len(rooms),
	})

	return rooms, nil
}
