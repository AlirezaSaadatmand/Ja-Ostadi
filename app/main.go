package main

import (
	"github.com/AlirezaSaadatmand/Ja-Ostadi/config"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/database"
	"github.com/gofiber/fiber/v2"
)

func main() {
	config.LoadConfig()
	database.ConnectDB()
	app := fiber.New()

	app.Get("/ja-ostadi", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"message": "Welcome to Ja Ostadi API!",
		})
	})

	app.Listen(":3000")
}
