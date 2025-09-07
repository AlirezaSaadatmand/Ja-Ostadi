package middleware

import (
	"github.com/AlirezaSaadatmand/Ja-Ostadi/config"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/utils"
	"github.com/gofiber/fiber/v2"
)

func AdminMiddleware() fiber.Handler {
	cfg := config.GetConfig()
	return func(c *fiber.Ctx) error {
		adminToken := c.Get("X-Admin-Token")
		expected := cfg.AdminToken

		if adminToken == "" || adminToken != expected {
			return utils.Error(c, fiber.StatusUnauthorized, "Unauthorized: admin access required")
		}

		return c.Next()
	}
}
