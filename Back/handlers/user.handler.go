package handlers

import (
	"github.com/AlirezaSaadatmand/Ja-Ostadi/utils"
	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
)
// UserCoursesRequest represents the request body for saving user courses
type UserCoursesRequest struct {
    CourseIDs []uint `json:"courseIds"`
}

// SaveUserCourses saves a list of courses for the authenticated user
// @Summary Save user's courses
// @Description Saves a list of course IDs for the authenticated user. Existing courses will be replaced.
// @Tags user
// @Accept json
// @Produce json
// @Param input body UserCoursesRequest true "Course IDs"
// @Success 201 {object} utils.APIResponse{data[]models.UserCourse}
// @Failure 400 {object} utils.APIResponse
// @Failure 401 {object} utils.APIResponse
// @Failure 500 {object} utils.APIResponse
// @Security ApiKeyAuth
// @Router /user/courses [post]
func (h *Handler) SaveUserCourses(c *fiber.Ctx) error {
    var req UserCoursesRequest

    userClaims := c.Locals("user")
    if userClaims == nil {
        return utils.Error(c, fiber.StatusBadRequest, "Unauthorized")
    }

    claims, ok := userClaims.(jwt.MapClaims)
    if !ok {
        return utils.Error(c, fiber.StatusBadRequest, "Invalid user claims")
    }

    userIDFloat, ok := claims["user_id"].(float64)
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

    userCourses, err := h.Services.SaveUserCourses(userID, req.CourseIDs)
    if err != nil {
        return utils.Error(c, fiber.StatusInternalServerError, err.Error())
    }

    return utils.Success(c, fiber.StatusCreated, userCourses, "User courses saved successfully")
}
