package routes

import (
	"github.com/AlirezaSaadatmand/Ja-Ostadi/handlers"
	"github.com/gofiber/fiber/v2"
)

func Router(app *fiber.App) {
	api := app.Group("/api/v1")

	api.Get("/test", handlers.Test)

	remove := api.Group("/remove")
	remove.Post("/" , handlers.DeleteAllData)
}
