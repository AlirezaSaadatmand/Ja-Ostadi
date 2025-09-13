package docs

import (
	"fmt"

	"github.com/AlirezaSaadatmand/Ja-Ostadi/config"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/swagger"
)

func SetupSwagger(app *fiber.App) {
	cfg := config.GetConfig()
	var domain string
	if cfg.MODE == "production" {
		domain = cfg.HOST
	} else {
		domain = fmt.Sprintf("%s:%s", cfg.HOST, cfg.PORT)
	}

	// Dynamic Swagger setup
	SwaggerInfo.Version = "1.0"
	SwaggerInfo.Host = domain
	SwaggerInfo.BasePath = "/api/v1"
	if cfg.MODE == "production" {
		SwaggerInfo.Schemes = []string{"https"}
	} else {
		SwaggerInfo.Schemes = []string{"http"}
	}
	SwaggerInfo.Title = "Ja Ostadi API"
	SwaggerInfo.Description = "API documentation for Ja Ostadi"

	app.Get("/swagger/*", swagger.HandlerDefault)
}
