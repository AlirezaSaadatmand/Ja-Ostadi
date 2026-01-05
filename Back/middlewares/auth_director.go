package middleware

import (
	"fmt"
	"strings"

	"github.com/AlirezaSaadatmand/Ja-Ostadi/config"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/utils"
	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
)

func DirectorAuth() fiber.Handler {
	return func(c *fiber.Ctx) error {
		var tokenString string
		authHeader := c.Get("Authorization")
		if authHeader != "" && strings.HasPrefix(authHeader, "Bearer ") {
			tokenString = strings.TrimPrefix(authHeader, "Bearer ")
		}

		if tokenString == "" {
			return utils.Error(c, fiber.StatusUnauthorized, "Authentication token required")
		}

		cfg := config.GetConfig()
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fiber.NewError(fiber.StatusUnauthorized, "Invalid token signing method")
			}
			return []byte(cfg.Secret_Token), nil
		})

		if err != nil || !token.Valid {
			return utils.Error(c, fiber.StatusUnauthorized, "Invalid or expired token")
		}

		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			return utils.Error(c, fiber.StatusUnauthorized, "Invalid token claims")
		}

		if role, ok := claims["role"].(string); !ok || role != "director" {
			return utils.Error(c, fiber.StatusForbidden, "Access denied. Director role required")
		}

		directorID, ok := claims["directorID"]
		if !ok {
			return utils.Error(c, fiber.StatusUnauthorized, "Invalid token payload: directorID missing")
		}

		var directorIDStr = fmt.Sprintf("%v", directorID) 

		c.Locals("directorID", directorIDStr)		
		if username, ok := claims["username"].(string); ok {
			c.Locals("username", username)
		}

		return c.Next()
	}
}