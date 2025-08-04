package handlers

import (
	"github.com/AlirezaSaadatmand/Ja-Ostadi/services"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/utils"
	"github.com/gofiber/fiber/v2"
)

type InstructorsData struct {
	Instructor services.InstructorMinimal `json:"instructor"`
	Relations  services.InstructorRelations `json:"relations"`
}

func GetInstructorData(c *fiber.Ctx) error {
	relations, err := services.GetInstructorRelations()
	if err != nil {
		return utils.Error(c, fiber.StatusInternalServerError, err.Error())
	}

	var instructorsData []InstructorsData

	for _, relation := range relations {
		instructor, err := services.GetInstructorData(int(relation.InstructorID))
		if err != nil {
			return utils.Error(c, fiber.StatusInternalServerError, err.Error())
		}

		instructorsData = append(instructorsData, InstructorsData{
			Instructor: instructor,
			Relations: relation,
		})
	}

	return utils.Success(c, fiber.StatusOK, instructorsData, "Data fetched successfully")
}
