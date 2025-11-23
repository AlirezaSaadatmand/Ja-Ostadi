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
	
	// Google Auth Routes
	api.Get("/auth/google/login", h.GoogleLoginHandler)
	api.Get("/auth/google/callback", h.GoogleCallbackHandler)

	api.Get("/auth/status", middleware.Auth(), h.AuthStatus)
	api.Get("/test", h.Test)
	
	// remove := api.Group("/remove")
	// remove.Post("/", h.DeleteSemesterData)

	// Semester Routes
	semesterRouter := api.Group("/semesters", middleware.Auth())
	semesterRouter.Get("/", h.GetSemesters)

	// Instructor Routes
	instructorRouter := api.Group("/instructors", middleware.Auth())
	instructorRouter.Get("/:instructorID/detail", h.GetInstructorDetail)
	instructorRouter.Get("/data", h.GetInstructorData)
	instructorRouter.Get("/courses/:instructorID", h.GetInstructorCourses)

	// Course Routes
	courseRouter := api.Group("/courses", middleware.Auth())
	courseRouter.Get("/:courseId/detail", h.GetCourseByID)
	courseRouter.Get("/semester/:semesterID", h.GetCoursesBySemester)
	courseRouter.Get("/semester/:semesterID/department/:departmentID", h.GetCoursesBySemesterAndDepartment)

	// Department Routes
	departmentRouter := api.Group("/departments", middleware.Auth())
	departmentRouter.Get("/", h.GetDepartments)
	departmentRouter.Get("/data", h.GetDepartmentsData)

	// Schedule Routes
	scheduleRouter := api.Group("/schedule")
	scheduleRouter.Get("/data", h.GetScheduleData)
	scheduleRouter.Get("/rooms", h.GetAllRooms)
	scheduleRouter.Get("/rooms/:roomID", h.GetRoomSchedule)

	// Admin Routes
	adminRoutes := api.Group("/admin", middleware.AdminMiddleware())
	adminRoutes.Post("/update/data", h.UploadJson)

	// User Routes
	userRoutes := api.Group("/user", middleware.Auth())
	userRoutes.Post("/courses", h.SaveUserCourses)

	// Food Routes 
	foodRoutes := api.Group("/food")
	foodRoutes.Get("/weekly", middleware.Auth(), h.GetWeeklyFood)
	foodRoutes.Post("/weekly",middleware.AdminMiddleware(), h.GetNewData)
	foodRoutes.Post("/image", middleware.AdminMiddleware(), h.UploadMealImage)
	foodRoutes.Patch("/:mealId/image", middleware.AdminMiddleware(), h.UpdateMealImage)
	foodRoutes.Post("/rate", middleware.Auth(), h.SubmitRating)
}
