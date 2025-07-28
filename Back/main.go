package main

import (
	"fmt"
	"log"

	"github.com/AlirezaSaadatmand/Ja-Ostadi/config"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/database"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/routes"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/scripts"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func main() {
	config.LoadConfig()
	database.ConnectDB()

	err := scripts.ImportData()
	if err != nil {
		log.Fatal("❌ Error importing JSON:", err)
	} else {
		log.Println("✅ Imported successfully")
	}

	app := fiber.New()

	app.Use(cors.New(cors.Config{
		AllowOrigins: "*", // Or "http://localhost:5173" or your front URL
		AllowHeaders: "Origin, Content-Type, Accept, Authorization",
	}))

	app.Get("/", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"message": "Welcome to Ja Ostadi API!",
		})
	})

	routes.Router(app)

	if err := app.Listen(fmt.Sprintf(":%s", config.GetConfig().PORT)); err != nil {
		log.Fatal("❌ Failed to start server:", err)
	}
}
