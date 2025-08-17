package handlers

import "github.com/gofiber/fiber/v2"

func (h *Handler) Test(c *fiber.Ctx) error {
	return c.JSON(fiber.Map{
		"status": "success",
		"data":   "test",
	})
}
