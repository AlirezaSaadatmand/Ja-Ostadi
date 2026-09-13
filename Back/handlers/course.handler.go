package handlers

import (
	"strconv"

	"github.com/AlirezaSaadatmand/Ja-Ostadi/services"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/utils"
	"github.com/gofiber/fiber/v2"
)

// GetCoursesBySemester returns all courses for a given semester
// @Summary Get courses by semester
// @Description Returns all courses for a specific semester
// @Tags courses
// @Produce json
// @Param semesterID path int true "Semester ID"
// @Success 200 {object} utils.APIResponse{data=[]services.CourseMinimal}
// @Failure 400 {object} utils.APIResponse
// @Failure 500 {object} utils.APIResponse
// @Router /courses/semester/{semesterID} [get]
func (h *Handler) GetCoursesBySemester(c *fiber.Ctx) error {
	semesterID := c.Params("semesterID")
	if semesterID == "" {
		return utils.Error(c, fiber.StatusBadRequest, "semesterID is required")
	}

	id, err := strconv.Atoi(semesterID)
	if err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "semesterID must be a valid number")
	}

	courses, err := h.Services.GetCoursesBySemester(id)
	if err != nil {
		return utils.Error(c, fiber.StatusInternalServerError, err.Error())
	}

	return utils.Success(c, fiber.StatusOK, courses, "Data fetched successfully")
}

type ClassTimeInfo struct {
	Day       string `json:"day"`
	StartTime string `json:"start_time"`
	EndTime   string `json:"end_time"`
	Room      string `json:"room"`
}

type CourseInstructor struct {
	ID             uint            `json:"id"`
	Name           string          `json:"name"`
	InstructorID   uint            `json:"instructor_id"`
	InstructorName string          `json:"instructor_name"`
	ClassTimes     []ClassTimeInfo `json:"class_times"`
}

// GetCoursesBySemesterAndDepartment returns courses for a semester and department
// @Summary Get courses by semester and department
// @Description Returns all courses for a specific semester and department
// @Tags courses
// @Produce json
// @Param semesterID path int true "Semester ID"
// @Param departmentID path int true "Department ID"
// @Success 200 {object} utils.APIResponse{data=[]handlers.CourseInstructor}
// @Failure 400 {object} utils.APIResponse
// @Failure 500 {object} utils.APIResponse
// @Router /courses/semester/{semesterID}/department/{departmentID} [get]
func (h *Handler) GetCoursesBySemesterAndDepartment(c *fiber.Ctx) error {
	semesterID := c.Params("semesterID")
	departmentID := c.Params("departmentID")
	if semesterID == "" || departmentID == "" {
		return utils.Error(c, fiber.StatusBadRequest, "semesterID and departmentID is required")
	}

	semester, err1 := strconv.Atoi(semesterID)
	department, err2 := strconv.Atoi(departmentID)
	if err1 != nil || err2 != nil {
		return utils.Error(c, fiber.StatusBadRequest, "semesterID and departmentID must be a valid number")
	}

	courses, err := h.Services.GetCoursesBySemesterAndDepartment(semester, department)
	if err != nil {
		return utils.Error(c, fiber.StatusBadRequest, err.Error())
	}

	instructors, err := h.Services.GetInstructorData()
	if err != nil {
		return utils.Error(c, fiber.StatusBadRequest, err.Error())
	}

	instructorMap := make(map[int]string)
	for _, i := range instructors {
		instructorMap[int(i.ID)] = i.Name
	}

	courseIDs := make([]uint, 0, len(courses))
	for _, course := range courses {
		courseIDs = append(courseIDs, course.ID)
	}

	classTimes, err := h.Services.GetClassTimesByCourseIDs(courseIDs)
	if err != nil {
		return utils.Error(c, fiber.StatusBadRequest, err.Error())
	}

	timesByCourse := make(map[uint][]ClassTimeInfo)
	for _, ct := range classTimes {
		timesByCourse[ct.CourseID] = append(timesByCourse[ct.CourseID], ClassTimeInfo{
			Day:       ct.Day,
			StartTime: ct.StartTime,
			EndTime:   ct.EndTime,
			Room:      ct.Room,
		})
	}

	var data []CourseInstructor
	for _, course := range courses {
		times := timesByCourse[course.ID]
		if times == nil {
			times = []ClassTimeInfo{}
		}

		data = append(data, CourseInstructor{
			ID:             course.ID,
			Name:           course.Name,
			InstructorID:   course.InstructorID,
			InstructorName: instructorMap[int(course.InstructorID)],
			ClassTimes:     times,
		})
	}

	return utils.Success(c, fiber.StatusOK, data, "Data fetched successfully")
}

type CourseDetail struct {
	Course     services.CourseDetail
	Instructor services.InstructorByID
	Department services.DepartmentMinimal
	ClassTime  []services.ScheduleTime
	Semeter    services.SemesterData
}

// GetCourseByID returns detailed information for a specific course
// @Summary Get course detail
// @Description Returns course details including instructor, department, class time, and semester
// @Tags courses
// @Produce json
// @Param courseId path int true "Course ID"
// @Success 200 {object} utils.APIResponse{data=handlers.CourseDetail}
// @Failure 400 {object} utils.APIResponse
// @Failure 500 {object} utils.APIResponse
// @Router /courses/{courseId}/detail [get]
func (h *Handler) GetCourseByID(c *fiber.Ctx) error {
	courseID := c.Params("courseID")
	if courseID == "" {
		return utils.Error(c, fiber.StatusBadRequest, "courseID is required")
	}

	courseInt, err := strconv.Atoi(courseID)
	if err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "courseID must be a valid number")
	}

	courseDetail, err := h.Services.GetCourseByID(courseInt)
	if err != nil {
		return utils.Error(c, fiber.StatusInternalServerError, err.Error())
	}

	classTimeDetail, err := h.Services.GetTimeSchedule(courseInt)
	if err != nil {
		return utils.Error(c, fiber.StatusInternalServerError, err.Error())
	}

	instructor, err := h.Services.GetInstructorByID(int(courseDetail.InstructorID))
	if err != nil {
		return utils.Error(c, fiber.StatusInternalServerError, err.Error())
	}

	department, err := h.Services.GetDepartmentByID(int(courseDetail.DepartmentID))
	if err != nil {
		return utils.Error(c, fiber.StatusInternalServerError, err.Error())
	}

	semeter, err := h.Services.GetSemesterByID(int(courseDetail.SemesterID))
	if err != nil {
		return utils.Error(c, fiber.StatusInternalServerError, err.Error())
	}

	response := CourseDetail{
		Course:     courseDetail,
		Instructor: instructor,
		Department: department,
		ClassTime:  classTimeDetail,
		Semeter:    semeter,
	}

	return utils.Success(c, fiber.StatusOK, response, "Data fetched successfully")
}
