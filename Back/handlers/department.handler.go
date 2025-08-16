package handlers

import (
	"github.com/AlirezaSaadatmand/Ja-Ostadi/services"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/utils"
	"github.com/gofiber/fiber/v2"
)

// GetDepartments returns the list of all departments
// @Summary Get departments
// @Description Returns all departments
// @Tags departments
// @Produce json
// @Success 200 {object} utils.APIResponse{data=[]services.DepartmentMinimal}
// @Failure 500 {object} utils.APIResponse
// @Router /departments/ [get]
func GetDepartments(c *fiber.Ctx) error {
	departments, err := services.GetDepartments()
	if err != nil {
		return utils.Error(c, fiber.StatusInternalServerError, err.Error())
	}

	return utils.Success(c, fiber.StatusOK, departments, "Data fetched successfully")
}

// GetDepartmentsData returns detailed department data
// @Summary Get detailed department data
// @Description Returns all departments with additional details
// @Tags departments
// @Produce json
// @Success 200 {object} utils.APIResponse{data=[]services.DepartmentDataResponse}
// @Failure 500 {object} utils.APIResponse
// @Router /departments/data [get]
func GetDepartmentsData(c *fiber.Ctx) error {
    departments, err := services.GetDepartmentsDataService()
    if err != nil {
		return utils.Error(c, fiber.StatusInternalServerError, err.Error())
    }

	return utils.Success(c, fiber.StatusOK, departments, "Data fetched successfully")
}