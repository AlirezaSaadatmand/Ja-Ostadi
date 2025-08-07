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
