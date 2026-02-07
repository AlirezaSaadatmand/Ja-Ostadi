package handlers

import (
	"context"
	"crypto/rand"
	"encoding/base64"
	"encoding/json"
	"strings"
	"time"

	"sync"

	"github.com/AlirezaSaadatmand/Ja-Ostadi/config"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/pkg/auth"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/pkg/token"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/types"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/utils"
	"github.com/gofiber/fiber/v2"
)

type stateData struct {
	Redirect string
	Expiry   time.Time
}

var (
	stateMap = make(map[string]stateData)
	mu       sync.Mutex
)

func saveState(state, redirect string, duration time.Duration) {
	mu.Lock()
	defer mu.Unlock()
	stateMap[state] = stateData{
		Redirect: redirect,
		Expiry:   time.Now().Add(duration),
	}
}

func getState(state string) (string, bool) {
	mu.Lock()
	defer mu.Unlock()
	data, ok := stateMap[state]
	if !ok || data.Expiry.Before(time.Now()) {
		delete(stateMap, state)
		return "", false
	}
	delete(stateMap, state)
	return data.Redirect, true
}

func generateState() string {
	b := make([]byte, 16)
	_, _ = rand.Read(b)
	return base64.URLEncoding.EncodeToString(b)
}

// GoogleLoginHandler generates a Google OAuth URL
// @Summary Generate Google OAuth login URL
// @Description Generates a Google login URL and saves a temporary OAuth state to prevent CSRF
// @Tags Auth
// @Param redirect query string false "Redirect path after successful login" default(/)
// @Success 200 {object} map[string]interface{} "Returns the Google OAuth URL"
// @Failure 500 {object} map[string]string "Internal server error"
// @Router /auth/google/login [get]
func (h *Handler) GoogleLoginHandler(c *fiber.Ctx) error {
	redirect := c.Query("redirect", "/")
	state := generateState()

	saveState(state, redirect, 5*time.Minute)

	url := auth.GoogleOauthConfig.AuthCodeURL(state)
	return utils.Success(c, fiber.StatusOK, fiber.Map{
		"auth_url": url,
	}, "Google login URL generated successfully")
}

// GoogleCallbackHandler handles the Google OAuth callback
// @Summary Handle Google OAuth callback
// @Description Exchanges authorization code for token, fetches Google user info, generates JWT, and redirects to frontend
// @Tags Auth
// @Param state query string true "OAuth state returned by Google"
// @Param code query string true "Authorization code returned by Google"
// @Success 302 "Redirects to frontend with JWT in query param"
// @Failure 400 {object} map[string]string "Code not found"
// @Failure 401 {object} map[string]string "Invalid or expired OAuth state"
// @Failure 500 {object} map[string]string "Internal server error"
// @Router /auth/google/callback [get]
func (h *Handler) GoogleCallbackHandler(c *fiber.Ctx) error {
	stateFromGoogle := c.Query("state")

	redirect, ok := getState(stateFromGoogle)
	if !ok {
		return utils.Error(c, fiber.StatusUnauthorized, "Invalid or expired OAuth state")
	}

	code := c.Query("code")
	if code == "" {
		return utils.Error(c, fiber.StatusBadRequest, "Code not found")
	}

	tokenResp, err := auth.GoogleOauthConfig.Exchange(context.Background(), code)
	if err != nil {
		return utils.Error(c, fiber.StatusInternalServerError, "Failed to exchange token")
	}

	googleClient := auth.GoogleOauthConfig.Client(context.Background(), tokenResp)
	resp, err := googleClient.Get("https://www.googleapis.com/oauth2/v2/userinfo")
	if err != nil {
		return utils.Error(c, fiber.StatusInternalServerError, "Failed to get user info")
	}
	defer resp.Body.Close()

	var gUser types.GoogleUser
	if err := json.NewDecoder(resp.Body).Decode(&gUser); err != nil {
		return utils.Error(c, fiber.StatusInternalServerError, "Failed to parse user info")
	}

	client, err := h.Services.FindOrCreateGoogleUser(gUser)
	if err != nil {
		return utils.Error(c, fiber.StatusInternalServerError, err.Error())
	}

	jwtToken, err := token.GenerateJWT(client.ID, client.Email)
	if err != nil {
		return utils.Error(c, fiber.StatusInternalServerError, "Failed to generate JWT")
	}

	cfg := config.GetConfig()
	redirectURL := cfg.Front_URL + redirect

	if strings.Contains(redirectURL, "?") {
		redirectURL += "&token=" + jwtToken
	} else {
		redirectURL += "?token=" + jwtToken
	}

	return c.Redirect(redirectURL)

}