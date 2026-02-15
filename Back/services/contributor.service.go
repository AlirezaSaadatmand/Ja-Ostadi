package services

import (
	"encoding/json"
	"errors"
	"net/http"

	"github.com/AlirezaSaadatmand/Ja-Ostadi/database"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/models"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/pkg/logging"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/types"
)

func (s *Services) UpdateContributors() error {

	url := "https://api.github.com/repos/AlirezaSaadatmand/Ja-Ostadi/contributors"

	resp, err := http.Get(url)
	if err != nil {
		s.Logger.Error(logging.External, logging.Get, "Failed to call GitHub API", map[logging.ExtraKey]interface{}{
			"url":   url,
			"error": err.Error(),
		})
		return errors.New("failed to fetch contributors")
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		s.Logger.Error(logging.External, logging.Get, "GitHub API returned non-200 status", map[logging.ExtraKey]interface{}{
			"url":        url,
			"statusCode": resp.StatusCode,
		})
		return errors.New("failed to fetch contributors from github")
	}

	var githubContributors []types.GithubContributor
	if err := json.NewDecoder(resp.Body).Decode(&githubContributors); err != nil {
		s.Logger.Error(logging.External, logging.Decode, "Failed to decode GitHub response", map[logging.ExtraKey]interface{}{
			"error": err.Error(),
		})
		return errors.New("failed to decode github response")
	}

	for _, gc := range githubContributors {

		contributor := models.Contributor{
			Login:         gc.Login,
			Avatar_url:    gc.Avatar_url,
			Html_url:      gc.Html_url,
			Contributions: gc.Contributions,
			Type:          gc.Type,
		}

		err := database.DB.
			Where("login = ?", gc.Login).
			Assign(contributor).
			FirstOrCreate(&contributor).Error

		if err != nil {
			s.Logger.Error(logging.Mysql, logging.Create, "Failed to save contributor", map[logging.ExtraKey]interface{}{
				"login": gc.Login,
				"error": err.Error(),
			})
			return errors.New("failed to save contributor")
		}
	}

	s.Logger.Info(logging.Mysql, logging.Create, "Contributors updated successfully", map[logging.ExtraKey]interface{}{
		"count": len(githubContributors),
	})

	return nil
}


func (s *Services) GetContributors() ([]models.Contributor, int64, error) {

	var contributors []models.Contributor
	var total int64

	if err := database.DB.Model(&models.Contributor{}).Count(&total).Error; err != nil {
		s.Logger.Error(logging.Mysql, logging.Select, "Failed to count contributors", map[logging.ExtraKey]interface{}{
			"error": err.Error(),
		})
		return nil, 0, errors.New("error counting contributors")
	}

	if err := database.DB.
		Order("contributions DESC").
		Find(&contributors).Error; err != nil {

		s.Logger.Error(logging.Mysql, logging.Select, "Failed to fetch contributors", map[logging.ExtraKey]interface{}{
			"error": err.Error(),
		})

		return nil, 0, errors.New("error fetching contributors")
	}

	s.Logger.Info(logging.Mysql, logging.Select, "Fetched contributors successfully", map[logging.ExtraKey]interface{}{
		"count": total,
	})

	return contributors, total, nil
}
