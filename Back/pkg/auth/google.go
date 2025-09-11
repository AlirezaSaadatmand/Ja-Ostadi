package auth

import (
	"github.com/AlirezaSaadatmand/Ja-Ostadi/config"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
)

var GoogleOauthConfig *oauth2.Config

func init() {
	cfg := config.GetConfig()
	GoogleOauthConfig = &oauth2.Config{
		RedirectURL:  "http://localhost:3003/api/v1/auth/google/callback",
		ClientID:     cfg.GoogleClientID,
		ClientSecret: cfg.GoogleClientSecret,
		Scopes: []string{
			"https://www.googleapis.com/auth/userinfo.email",
			"https://www.googleapis.com/auth/userinfo.profile",
		},
		Endpoint: google.Endpoint,
	}
}
