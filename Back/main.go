package main

import (
	"log"
	"fmt"

	"github.com/AlirezaSaadatmand/Ja-Ostadi/config"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/database"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/routes"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/scripts"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/docs"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func main() {
	// Load Config and DB
	config.LoadConfig()
	cfg := config.GetConfig()
	database.ConnectDB()

	err := scripts.ImportData()
	if err != nil {
		log.Fatal("❌ Error importing JSON:", err)
	} else {
		log.Println("✅ Imported successfully")
	}

	app := fiber.New()

	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowHeaders: "Origin, Content-Type, Accept, Authorization",
	}))

	// Root route
	app.Get("/", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"message": "Welcome to Ja Ostadi API!",
		})
	})

	// Swagger setup
	docs.SetupSwagger(app)

	// API routes
	routes.Router(app)

	if err := app.Listen(fmt.Sprintf(":%s", cfg.PORT)); err != nil {
		log.Fatal("❌ Failed to start server:", err)
	}
}
