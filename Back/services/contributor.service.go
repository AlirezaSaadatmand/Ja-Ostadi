package services

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"

	"github.com/AlirezaSaadatmand/Ja-Ostadi/database"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/models"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/pkg/logging"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/types"
)

func (s *Services) UpdateContributors() error {

	url := "https://api.github.com/repos/AlirezaSaadatmand/Ja-Ostadi/contributors"

	fmt.Println(url)
	resp, err := http.Get(url)
	fmt.Println(resp)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return errors.New("failed to fetch contributors from github")
	}

	var githubContributors []types.GithubContributor
	if err := json.NewDecoder(resp.Body).Decode(&githubContributors); err != nil {
		return err
	}

	for _, gc := range githubContributors {
		fmt.Println(gc)

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
			s.Logger.Error(logging.Mysql, logging.Create, "Failed to save contributor", nil)
			return err
		}
	}

	s.Logger.Info(logging.Mysql, logging.Create, "Contributors updated successfully", nil)

	return nil
}
