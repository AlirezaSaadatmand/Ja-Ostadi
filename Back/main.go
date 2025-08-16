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

	"github.com/AlirezaSaadatmand/Ja-Ostadi/docs"
	_ "github.com/AlirezaSaadatmand/Ja-Ostadi/docs"
	"github.com/gofiber/swagger"
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

	// --- Dynamic Swagger setup ---
	docs.SwaggerInfo.Version = "1.0"
	docs.SwaggerInfo.Host = fmt.Sprintf("%s:%s", cfg.HOST, cfg.PORT)
	docs.SwaggerInfo.BasePath = "/api/v1"
	if cfg.MODE == "production" {
		docs.SwaggerInfo.Schemes = []string{"https"}
	} else {
		docs.SwaggerInfo.Schemes = []string{"http"}
	}
	docs.SwaggerInfo.Title = "Ja Ostadi API"
	docs.SwaggerInfo.Description = "API documentation for Ja Ostadi"

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

	app.Get("/swagger/*", swagger.HandlerDefault)

	routes.Router(app)

	if err := app.Listen(fmt.Sprintf(":%s", cfg.PORT)); err != nil {
		log.Fatal("❌ Failed to start server:", err)
	}
}
