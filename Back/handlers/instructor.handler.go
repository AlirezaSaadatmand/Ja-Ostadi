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
func (h *Handler) GetInstructorData(c *fiber.Ctx) error {
	relations, err := h.Services.GetInstructorRelations()
	if err != nil {
		return utils.Error(c, fiber.StatusInternalServerError, err.Error())
	}

	var instructorsData []InstructorsData

	instructors, err := h.Services.GetInstructorData()
	if err != nil {
		return utils.Error(c, fiber.StatusInternalServerError, err.Error())
	}

	instructorMap := make(map[int]services.InstructorMinimal)
	for _, i := range instructors {
		instructorMap[int(i.ID)] = i
	}

	for _, relation := range relations {
		instructorsData = append(instructorsData, InstructorsData{
			Instructor: instructorMap[int(relation.InstructorID)],
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
func (h *Handler) GetInstructorCourses(c *fiber.Ctx) error {

	instructorIdParam := c.Params("instructorID")
	instructorId, err := strconv.Atoi(instructorIdParam)
	if err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid instructor ID")
	}

	semesters, err := h.Services.GetSemesters()
	if err != nil {
		return utils.Error(c, fiber.StatusInternalServerError, err.Error())
	}

	var result []InstructorCoursesData

	for _, semester := range semesters {
		courses, err := h.Services.GetInstructorCourses(instructorId, int(semester.ID))
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
func (h *Handler) GetInstructorDetail(c *fiber.Ctx) error {
	instructorIdParam := c.Params("instructorID")
	instructorId, err := strconv.Atoi(instructorIdParam)
	if err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid instructor ID")
	}
	data, err := h.Services.GetInstructorByID(instructorId)
	if err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "invalid instructor ID")
	}
	
	return utils.Success(c, fiber.StatusOK, data, "Data fetched successfully")
}
