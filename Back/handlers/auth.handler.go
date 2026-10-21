package handlers

import (
	"errors"

	"github.com/AlirezaSaadatmand/Ja-Ostadi/database"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/models"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/services"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/types"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/utils"
	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
)

type LoginResponse struct {
	Token string `json:"token"`
}

// Login authenticates a client
// @Summary Login Client
// @Description Authenticate Client and return JWT token
// @Tags Auth
// @Accept json
// @Produce json
// @Param body body types.LoginRequest true "Client login credentials"
// @Success 200 {object} utils.APIResponse{data=LoginResponse} "Login successful"
// @Failure 400 {object} utils.APIResponse "Bad Request: invalid input"
// @Failure 401 {object} utils.APIResponse "Unauthorized: invalid credentials"
// @Failure 500 {object} utils.APIResponse "Internal Server Error"
// @Router /auth/login [post]
func (h *Handler) Login(c *fiber.Ctx) error {
	var req types.LoginRequest
	if err := c.BodyParser(&req); err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "Invalid request body")
	}
	if req.Username == "" || req.Password == "" {
		return utils.Error(c, fiber.StatusBadRequest, "Username and password are required")
	}

	token, err := h.Services.AuthenticateClient(req.Username, req.Password)
	if err != nil {
		if errors.Is(err, services.ErrInvalidCredentials) {
			return utils.Error(c, fiber.StatusUnauthorized, "Invalid username or password")
		}
		return utils.Error(c, fiber.StatusInternalServerError, "Authentication failed")
	}

	return utils.Success(c, fiber.StatusOK, LoginResponse{Token: token}, "Login successful")
}

// AuthStatus returns authentication status of the client
// @Summary Get authentication status
// @Description Checks if the client is authenticated based on JWT (sent via Authorization header) and returns the client's current role and username from the database
// @Tags Auth
// @Success 200 {object} utils.APIResponse{data=object{isAuthenticated=bool,role=string,username=string}} "Authentication status, role, and username"
// @Failure 401 {object} utils.APIResponse "Unauthorized: client is not authenticated"
// @Security BearerAuth
// @Router /auth/status [get]
func (h *Handler) AuthStatus(c *fiber.Ctx) error {
	raw := c.Locals("client")
	if raw == nil {
		return utils.Error(c, fiber.StatusUnauthorized, "Client is Unauthenticated")
	}

	claims, ok := raw.(jwt.MapClaims)
	if !ok {
		return utils.Error(c, fiber.StatusUnauthorized, "Invalid client claims")
	}

	clientIDf, ok := claims["clientID"].(float64)
	if !ok || clientIDf == 0 {
		return utils.Error(c, fiber.StatusUnauthorized, "Invalid client ID in token")
	}

	var client models.Client
	if err := database.DB.First(&client, uint(clientIDf)).Error; err != nil {
		return utils.Error(c, fiber.StatusUnauthorized, "Client not found")
	}

	return utils.Success(c, fiber.StatusOK, fiber.Map{
		"isAuthenticated": true,
		"username":        client.Username,
		"role":            client.Role,
	}, "Client is Authenticated")
}

// Register creates a new client account and logs them in
// @Summary Register Client
// @Description Create a new client account (public). Returns a JWT on success.
// @Tags Auth
// @Accept json
// @Produce json
// @Param body body types.RegisterRequest true "Registration data"
// @Success 201 {object} utils.APIResponse{data=LoginResponse} "Account created"
// @Failure 400 {object} utils.APIResponse "Bad Request: invalid input"
// @Failure 409 {object} utils.APIResponse "Conflict: username already exists"
// @Failure 500 {object} utils.APIResponse "Internal Server Error"
// @Router /auth/register [post]
func (h *Handler) Register(c *fiber.Ctx) error {
	var req types.RegisterRequest
	if err := c.BodyParser(&req); err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "Invalid request body")
	}

	client, err := h.Services.RegisterClient(req.Username, req.Password)
	switch {
	case errors.Is(err, services.ErrUsernameExists):
		return utils.Error(c, fiber.StatusConflict, "Username already exists")
	case errors.Is(err, services.ErrWeakPassword):
		return utils.Error(c, fiber.StatusBadRequest, "Password must be at least 8 characters")
	case errors.Is(err, services.ErrInvalidUsername):
		return utils.Error(c, fiber.StatusBadRequest, "Username must be 3–32 characters")
	case errors.Is(err, services.ErrInvalidRole):
		return utils.Error(c, fiber.StatusBadRequest, "Invalid role")
	case err != nil:
		return utils.Error(c, fiber.StatusInternalServerError, "Registration failed")
	}

	token, err := h.Services.AuthenticateClient(client.Username, req.Password)
	if err != nil {
		return utils.Success(c, fiber.StatusCreated, fiber.Map{}, "Account created, please log in")
	}

	return utils.Success(c, fiber.StatusCreated, LoginResponse{Token: token}, "Account created")
}