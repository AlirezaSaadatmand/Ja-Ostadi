package routes

import (
	"github.com/AlirezaSaadatmand/Ja-Ostadi/handlers"
	"github.com/gofiber/fiber/v2"
)

func Router(app *fiber.App) {
	api := app.Group("/api/v1")

	api.Get("/test", handlers.Test)

	remove := api.Group("/remove")
	remove.Post("/", handlers.DeleteAllData)

	// Course Routes
	courseRouter := api.Group("/courses")
	courseRouter.Get("/semester/:semesterID", handlers.GetCoursesBySemester)
	courseRouter.Get("/semester/:semesterID/department/:departmentID", handlers.GetCoursesBySemesterAndDepartment)
	// courseRouter.Get("/:id", handlers.GetCourseByID)

	
	// Department Routes
	departmentRouter := api.Group("/departments")
	departmentRouter.Get("/", handlers.GetDepartments)


	// Schedule Routes
	scheduleRouter := api.Group("/schedule")
	scheduleRouter.Get("/data", handlers.GetScheduleData)
}

