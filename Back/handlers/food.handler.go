package handlers

import (
	"github.com/AlirezaSaadatmand/Ja-Ostadi/database"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/scripts"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/utils"
	"github.com/gofiber/fiber/v2"
)

func (h *Handler) GetWeeklyFood(c *fiber.Ctx) error {
	data := c.Body()
	db := database.DB
	result, err := scripts.ParseAndUpdateFoodWeek(db, data)
	if err != nil {
		return utils.Error(c, fiber.StatusInternalServerError, err.Error())
	}

	return utils.Success(c, fiber.StatusOK, result, "Data fetched successfully")
}
