package handlers

import (
	"github.com/AlirezaSaadatmand/Ja-Ostadi/types"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/utils"
	"github.com/gofiber/fiber/v2"
)

type LoginResponse struct {
	Token    string           `json:"token"`
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
		if err.Error() == "invalid credentials" {
			return utils.Error(c, fiber.StatusUnauthorized, "Invalid username or password")
		}
		return utils.Error(c, fiber.StatusInternalServerError, "Authentication failed")
	}

	response := LoginResponse{
		Token: token,
	}

	return utils.Success(c, fiber.StatusOK, response, "Login successful")
}

// AuthStatus returns authentication status of the client
// @Summary Get authentication status
// @Description Checks if the client is authenticated based on JWT (sent via Authorization header)
// @Tags Auth
// @Success 200 {object} map[string]bool "Returns isAuthenticated: true/false"
// @Router /auth/status [get]
func (h *Handler) AuthStatus(c *fiber.Ctx) error {
	client := c.Locals("client")
	if client != nil {
		return utils.Success(c, fiber.StatusOK, fiber.Map{"isAuthenticated": true}, "Client is Authenticated")
	}
		return utils.Error(c, fiber.StatusUnauthorized, "Client is Unauthenticated")
}
