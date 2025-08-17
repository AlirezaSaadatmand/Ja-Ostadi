package services

import (
	"errors"

	"github.com/AlirezaSaadatmand/Ja-Ostadi/database"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/models"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/pkg/logging"
)

type SemesterData struct {
	ID   uint   `json:"id"`
	Name string `json:"name"`
}

func (s *Services) GetSemesters() ([]SemesterData, error) {
	var semesters []SemesterData
	err := database.DB.
		Model(&models.Semester{}).
		Select("ID, Name").
		Find(&semesters).Error
	if err != nil {
		s.Logger.Error(logging.Mysql, logging.Select, "Failed to fetch semesters", map[logging.ExtraKey]interface{}{"error": err.Error()})
		return nil, errors.New("error getting data")
	}

	s.Logger.Info(logging.Mysql, logging.Select, "Fetched all semesters successfully", nil)
	return semesters, nil
}

func (s *Services) GetSemesterByID(semesterID int) (SemesterData, error) {
	var semester SemesterData
	err := database.DB.
		Model(&models.Semester{}).
		Select("ID, Name").
		Where("id = ?", semesterID).
		Find(&semester).Error
	if err != nil {
		s.Logger.Error(logging.Mysql, logging.Select, "Failed to fetch semester by ID", map[logging.ExtraKey]interface{}{"semesterID": semesterID, "error": err.Error()})
		return semester, errors.New("error getting data")
	}

	s.Logger.Info(logging.Mysql, logging.Select, "Fetched semester successfully", map[logging.ExtraKey]interface{}{"semesterID": semesterID})
	return semester, nil
}
