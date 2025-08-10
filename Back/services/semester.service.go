package services

import (
	"errors"

	"github.com/AlirezaSaadatmand/Ja-Ostadi/database"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/models"
)

type SemesterData struct {
	ID   uint   `json:"id"`
	Name string `json:"name"`
}

func GetSemesters() ([]SemesterData, error) {

	var semesters []SemesterData
	err := database.DB.
		Model(&models.Semester{}).
		Select("ID, Name").
		Find(&semesters).Error
	if err != nil {
		return nil, errors.New("error getting data")
	}

	return semesters, nil
}

func GetSemesterByID(semeterID int) (SemesterData, error) {
	var semester SemesterData
	err := database.DB.
		Model(&models.Semester{}).
		Select("ID, Name").
		Where("id = ?", semeterID).
		Find(&semester).Error
	if err != nil {
		return semester, errors.New("error getting data")
	}

	return semester, nil
}