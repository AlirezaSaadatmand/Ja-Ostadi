package handlers

import (
	"github.com/AlirezaSaadatmand/Ja-Ostadi/utils"
	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
)

type UserCoursesRequest struct {
	CourseIDs []uint `json:"courseIds"`
}

type UserCourseResponse struct {
	ID       uint `json:"id"`
	UserID   uint `json:"user_id"`
	CourseID uint `json:"course_id"`
}

// SaveUserCourses saves a list of courses for the authenticated user
// @Summary Save user's courses
// @Description Saves a list of course IDs for the authenticated user. If any of the IDs do not exist in the courses table, none are saved and the invalid IDs are returned.
// @Tags user
// @Accept json
// @Produce json
// @Param input body UserCoursesRequest true "Course IDs"
// @Success 201 {object} utils.APIResponse{data=[]UserCourseResponse} "User courses saved successfully"
// @Failure 400 {object} utils.APIResponse{data=[]uint} "Invalid course IDs"
// @Failure 401 {object} utils.APIResponse "Unauthorized"
// @Failure 500 {object} utils.APIResponse "Internal server error"
// @Security ApiKeyAuth
// @Router /user/courses [post]
func (h *Handler) SaveUserCourses(c *fiber.Ctx) error {
	var req UserCoursesRequest

	userClaims := c.Locals("user").(jwt.MapClaims)
	userIDFloat, ok := userClaims["user_id"].(float64)
	if !ok {
		return utils.Error(c, fiber.StatusBadRequest, "Invalid user_id in claims")
	}
	userID := uint(userIDFloat)

	if err := c.BodyParser(&req); err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "Invalid request body")
	}

	if len(req.CourseIDs) == 0 {
		return utils.Error(c, fiber.StatusBadRequest, "No courses provided")
	}

	missing, err := h.Services.CheckCourseIDs(req.CourseIDs)
	if err != nil {
		return utils.Error(c, fiber.StatusInternalServerError, "Error validating course IDs")
	}
	if len(missing) > 0 {
		return utils.ErrorWithData(c, fiber.StatusBadRequest, missing, "Some course IDs do not exist")
	}

	userCourses, err := h.Services.ReplaceUserCourses(userID, req.CourseIDs)
	if err != nil {
		return utils.Error(c, fiber.StatusInternalServerError, "Error saving courses")
	}

	return utils.Success(c, fiber.StatusCreated, userCourses, "User courses saved successfully")
}
