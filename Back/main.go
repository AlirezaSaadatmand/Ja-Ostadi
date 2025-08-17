package main

import (
	"fmt"

	"github.com/AlirezaSaadatmand/Ja-Ostadi/config"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/database"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/docs"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/pkg/logging"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/routes"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/scripts"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func main() {
	config.LoadConfig()
	cfg := config.GetConfig()
	database.ConnectDB()

	logger := logging.NewLogger()

	if err := scripts.ImportData(); err != nil {
		logger.Error(logging.General, logging.Startup, "Importing JSON failed", map[logging.ExtraKey]interface{}{"error": err})
	} else {
		logger.Info(logging.General, logging.Startup, "Imported JSON successfully", nil)
	}

	app := fiber.New()

	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowHeaders: "Origin, Content-Type, Accept, Authorization",
	}))

	app.Get("/", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"message": "Welcome to Ja Ostadi API!",
		})
	})

	docs.SetupSwagger(app)
	routes.Router(app)

	if err := app.Listen(fmt.Sprintf(":%s", cfg.PORT)); err != nil {
		logger.Fatal(logging.General, logging.Startup, "Failed to start server", map[logging.ExtraKey]interface{}{"error": err})
	}
}
