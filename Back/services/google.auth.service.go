package services

import (
	"errors"

	"github.com/AlirezaSaadatmand/Ja-Ostadi/database"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/models"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/types"
	"gorm.io/gorm"
)

func (s *Services) FindOrCreateGoogleUser(gUser types.GoogleUser) (models.Client, error) {
	var client models.Client

	err := database.DB.Where("google_id = ?", gUser.ID).First(&client).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			client = models.Client{
				GoogleID:      gUser.ID,
				Email:         gUser.Email,
				VerifiedEmail: gUser.VerifiedEmail,
				Name:          gUser.Name,
				GivenName:     gUser.GivenName,
				FamilyName:    gUser.FamilyName,
				Picture:       gUser.Picture,
				Locale:        gUser.Locale,
				Provider:      "google",
			}

			if err := database.DB.Create(&client).Error; err != nil {
				return client, errors.New("failed to create user in DB")
			}
		} else {
			return client, errors.New("failed to query user in DB")
		}
	}

	return client, nil
}
