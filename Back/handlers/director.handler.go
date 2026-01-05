package handlers

import (
	"github.com/AlirezaSaadatmand/Ja-Ostadi/utils"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/types"
	"github.com/gofiber/fiber/v2"
)

type LoginDirectorResponse struct {
	Token    string          `json:"token"`
	Director DirectorResponse `json:"director"`
}

// LoginDirector authenticates a department director
// @Summary Login department director
// @Description Authenticate department director and return JWT token
// @Tags Director
// @Accept json
// @Produce json
// @Param body body types.LoginDirectorRequest true "Director login credentials"
// @Success 200 {object} utils.APIResponse{data=LoginDirectorResponse} "Login successful"
// @Failure 400 {object} utils.APIResponse "Bad Request: invalid input"
// @Failure 401 {object} utils.APIResponse "Unauthorized: invalid credentials"
// @Failure 500 {object} utils.APIResponse "Internal Server Error"
// @Router /directors/login [post]
func (h *Handler) LoginDirector(c *fiber.Ctx) error {
	var req types.LoginDirectorRequest
	if err := c.BodyParser(&req); err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "Invalid request body")
	}

	if req.Username == "" || req.Password == "" {
		return utils.Error(c, fiber.StatusBadRequest, "Username and password are required")
	}

	director, token, err := h.Services.AuthenticateDirector(req.Username, req.Password)
	if err != nil {
		if err.Error() == "invalid credentials" {
			return utils.Error(c, fiber.StatusUnauthorized, "Invalid username or password")
		}
		return utils.Error(c, fiber.StatusInternalServerError, "Authentication failed")
	}

	response := LoginDirectorResponse{
		Token: token,
		Director: DirectorResponse{
			ID:       director.ID,
			Username: director.Username,
		},
	}

	return utils.Success(c, fiber.StatusOK, response, "Login successful")
}