package middleware

import (
	"strings"

	"github.com/AlirezaSaadatmand/Ja-Ostadi/pkg/token"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/utils"
	"github.com/gofiber/fiber/v2"
)

func Auth() fiber.Handler {
    return func(c *fiber.Ctx) error {
        authHeader := c.Get("Authorization")
        if authHeader == "" {
            return utils.Error(c, fiber.StatusUnauthorized, "Missing Authorization header")
        }
        parts := strings.SplitN(authHeader, " ", 2)
        if len(parts) != 2 || parts[0] != "Bearer" {
            return utils.Error(c, fiber.StatusUnauthorized, "Invalid Authorization header format")
        }

        tokenStr := parts[1]

        claims, err := token.ParseJWT(tokenStr)
        if err != nil {
            return utils.Error(c, fiber.StatusUnauthorized, err.Error())
        }
		
        c.Locals("user", claims)
        return c.Next()
    }
}

