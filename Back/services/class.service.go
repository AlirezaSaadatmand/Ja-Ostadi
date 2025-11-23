package services

import (
	"errors"

	"github.com/AlirezaSaadatmand/Ja-Ostadi/database"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/models"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/pkg/logging"
)

type ClassRooms struct {
	ID       uint   `json:"id"`
	Room     string `json:"room"`
	CourseID uint   `json:"courseId"`
}

func (s *Services) GetAllUniqueRooms() ([]ClassRooms, error) {
	var rooms []ClassRooms

	err := database.DB.
		Model(&models.ClassTime{}).
		Find(&rooms).Error

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



func (s *Services) GetRecordsByRoom(room string) ([]models.ClassTime, error) {
	var records []models.ClassTime

	err := database.DB.
		Where("room = ?", room).
		Distinct().
		Find(&records).Error

	if err != nil {
		s.Logger.Error(logging.Mysql, logging.Select, "Failed to get records by room", map[logging.ExtraKey]interface{}{
			"error": err.Error(),
			"room":  room,
		})
		return nil, errors.New("error getting records by room")
	}

	s.Logger.Info(logging.Mysql, logging.Select, "Fetched records by room successfully", map[logging.ExtraKey]interface{}{
		"room":  room,
		"count": len(records),
	})

	return records, nil
}
