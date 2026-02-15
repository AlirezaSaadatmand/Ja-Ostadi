package routes

import (
	"github.com/AlirezaSaadatmand/Ja-Ostadi/handlers"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/middlewares"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/pkg/logging"
	"github.com/gofiber/fiber/v2"
)

func Router(app *fiber.App, logger logging.Logger) {
	h := handlers.NewHandler(logger)
	m := middlewares.NewMiddleware(logger)

	api := app.Group("/api/v1")

	api.Get("/contributors", h.GetContributors)

	// Google Auth Routes
	api.Get("/auth/google/login", h.GoogleLoginHandler)
	api.Get("/auth/google/callback", h.GoogleCallbackHandler)

	api.Post("/auth/login", h.Login)
	api.Get("/auth/status", m.Auth(), h.AuthStatus)
	api.Get("/test", h.Test)

	// remove := api.Group("/remove")
	// remove.Post("/", h.DeleteSemesterData)

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
	scheduleRouter.Get("/rooms", h.GetAllRooms)
	scheduleRouter.Get("/rooms/:roomID", h.GetRoomSchedule)

	// Admin Routes
	adminRoutes := api.Group("/admin", m.AdminMiddleware())
	adminRoutes.Post("/update/data", h.UploadJson)
	adminRoutes.Post("/clients", h.RegisterClient)
	adminRoutes.Patch("/clients/:id", h.UpdateClient)
	adminRoutes.Delete("/clients/:id", h.DeleteClient)
	adminRoutes.Post("/update/contributors", h.UpdateContributors)

	// Director Routes
	directorRoutes := api.Group("/temp-courses", m.Auth(), m.DirectorAuth())
	directorRoutes.Get("/", h.GetTempCourses)
	directorRoutes.Post("/", h.CreateTempCourse)
	directorRoutes.Patch("/:id", h.UpdateTempCourse)
	directorRoutes.Delete("/:id", h.DeleteTempCourse)

	// User Routes
	userRoutes := api.Group("/user")
	userRoutes.Post("/courses", h.SaveUserCourses)

	// Food Routes
	foodRoutes := api.Group("/food")
	foodRoutes.Get("/weekly", m.Auth(), h.GetWeeklyFood)
	foodRoutes.Post("/weekly", m.AdminMiddleware(), h.GetNewData)
	foodRoutes.Post("/image", m.AdminMiddleware(), h.UploadMealImage)
	foodRoutes.Patch("/:mealId/image", m.AdminMiddleware(), h.UpdateMealImage)
	foodRoutes.Post("/rate", m.Auth(), h.SubmitRating)
}
