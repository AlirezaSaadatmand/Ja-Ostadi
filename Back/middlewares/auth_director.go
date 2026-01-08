package middlewares

import (
    "fmt"

    "github.com/AlirezaSaadatmand/Ja-Ostadi/utils"
    "github.com/gofiber/fiber/v2"
    "github.com/golang-jwt/jwt/v5"
)

func (m *Middlewares) DirectorAuth() fiber.Handler {
    return func(c *fiber.Ctx) error {
        claims := c.Locals("client")
        if claims == nil {
            return utils.Error(c, fiber.StatusUnauthorized, "Authentication required")
        }

        jwtClaims := claims.(jwt.MapClaims)

        if role, ok := jwtClaims["role"].(string); !ok || role != "director" {
            return utils.Error(c, fiber.StatusForbidden, "Access denied. Director role required")
        }

        directorID, ok := jwtClaims["clientID"]
        if !ok {
            return utils.Error(c, fiber.StatusUnauthorized, "Invalid token payload: ID missing")
        }

        directorIDStr := fmt.Sprintf("%v", directorID)
        c.Locals("directorID", directorIDStr)
        
        if username, ok := jwtClaims["username"].(string); ok {
            c.Locals("username", username)
        }

        return c.Next()
    }
}