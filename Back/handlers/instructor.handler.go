package handlers

import (
	"strconv"

	"github.com/AlirezaSaadatmand/Ja-Ostadi/services"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/utils"
	"github.com/gofiber/fiber/v2"
)

type InstructorsData struct {
	Instructor services.InstructorMinimal   `json:"instructor"`
	Relations  services.InstructorRelations `json:"relations"`
}

// GetInstructorData returns all instructors with their relations
// @Summary Get instructors data
// @Description Returns instructors along with their relations
// @Tags instructors
// @Produce json
// @Success 200 {object} utils.APIResponse{data=[]handlers.InstructorsData}
// @Failure 500 {object} utils.APIResponse
// @Router /instructors/data [get]
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
			Relations:  relation,
		})
	}

	return utils.Success(c, fiber.StatusOK, instructorsData, "Data fetched successfully")
}

type InstructorCoursesData struct {
	Semester services.SemesterData       `json:"semester"`
	Courses  []services.InstructorCourse `json:"courses"`
}

// GetInstructorCourses returns courses for a specific instructor grouped by semester
// @Summary Get instructor courses
// @Description Returns courses of an instructor per semester
// @Tags instructors
// @Produce json
// @Param instructorID path int true "Instructor ID"
// @Success 200 {object} utils.APIResponse{data=[]handlers.InstructorCoursesData}
// @Failure 400 {object} utils.APIResponse
// @Failure 500 {object} utils.APIResponse
// @Router /instructors/courses/{instructorID} [get]
func GetInstructorCourses(c *fiber.Ctx) error {

	instructorIdParam := c.Params("instructorID")
	instructorId, err := strconv.Atoi(instructorIdParam)
	if err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid instructor ID")
	}

	semesters, err := services.GetSemesters()
	if err != nil {
		return utils.Error(c, fiber.StatusInternalServerError, err.Error())
	}

	var result []InstructorCoursesData

	for _, semester := range semesters {
		courses, err := services.GetInstructorCourses(instructorId, int(semester.ID))
		if err != nil {
			return utils.Error(c, fiber.StatusInternalServerError, err.Error())
		}

		if len(courses) == 0 {
			continue
		}

		result = append(result, InstructorCoursesData{
			Semester: semester,
			Courses:  courses,
		})
	}

	return utils.Success(c, fiber.StatusOK, result, "Data fetched successfully")
}

// GetInstructorDetail returns detailed info about a specific instructor
// @Summary Get instructor detail
// @Description Returns detailed information about an instructor
// @Tags instructors
// @Produce json
// @Param instructorID path int true "Instructor ID"
// @Success 200 {object} utils.APIResponse
// @Failure 400 {object} utils.APIResponse
// @Router /instructors/{instructorID}/detail [get]
func GetInstructorDetail(c *fiber.Ctx) error {
	return utils.Success(c, fiber.StatusOK, nil, "Data fetched successfully")
}