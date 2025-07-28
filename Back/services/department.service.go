package services

import (
	"errors"

	"github.com/AlirezaSaadatmand/Ja-Ostadi/database"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/models"
)

type DepartmentMinimal struct {
	ID   uint   `json:"id"`
	Name string `json:"name"`
}

func GetDepartments() ([]DepartmentMinimal, error) {

	var departments []DepartmentMinimal
	err := database.DB.
		Model(&models.Department{}).
		Select("id, name").
		Find(&departments).Error
	if err != nil {
		return nil, errors.New("error getting data")
	}

	return departments, nil
}
