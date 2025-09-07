package routes

import (
	"github.com/AlirezaSaadatmand/Ja-Ostadi/handlers"
	middleware "github.com/AlirezaSaadatmand/Ja-Ostadi/middlewares"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/pkg/logging"
	"github.com/gofiber/fiber/v2"
)

func Router(app *fiber.App, logger logging.Logger) {
	h := handlers.NewHandler(logger)

	api := app.Group("/api/v1")

	api.Get("/test", h.Test)

	remove := api.Group("/remove")
	remove.Post("/", h.DeleteAllData)

	// Semester Routes
	semesterRouter := api.Group("/semesters")
	semesterRouter.Get("/", h.GetSemesters)

	// Instructor Routes
	instructorRouter := api.Group("/instructors")
	instructorRouter.Get("/:instructorID/detail", h.GetInstructorDetail)
	instructorRouter.Get("/data", h.GetInstructorData)
	instructorRouter.Get("/courses/:instructorID", h.GetInstructorCourses)

	// Course Routes
	courseRouter := api.Group("/courses")
	courseRouter.Get("/:courseId/detail", h.GetCourseByID)
	courseRouter.Get("/semester/:semesterID", h.GetCoursesBySemester)
	courseRouter.Get("/semester/:semesterID/department/:departmentID", h.GetCoursesBySemesterAndDepartment)

	// Department Routes
	departmentRouter := api.Group("/departments")
	departmentRouter.Get("/", h.GetDepartments)
	departmentRouter.Get("/data", h.GetDepartmentsData)

	// Schedule Routes
	scheduleRouter := api.Group("/schedule")
	scheduleRouter.Get("/data", h.GetScheduleData)

	// Admin Routes
	adminRoutes := api.Group("/admin", middleware.AdminMiddleware())
	adminRoutes.Post("/upload/data", h.UploadJson)
}
