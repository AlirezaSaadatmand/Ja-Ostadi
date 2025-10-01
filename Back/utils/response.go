package utils

import "github.com/gofiber/fiber/v2"

type APIResponse struct {
	Status  string      `json:"status"`
	Message string      `json:"message,omitempty"`
	Data    interface{} `json:"data,omitempty"`
}

func Success(c *fiber.Ctx, code int, data interface{}, message string) error {
	return c.Status(code).JSON(APIResponse{
		Status:  "success",
		Message: message,
		Data:    data,
	})
}

func Error(c *fiber.Ctx, code int, message string) error {
	return c.Status(code).JSON(APIResponse{
		Status:  "error",
		Message: message,
	})
}

func ErrorWithData(c *fiber.Ctx, code int,data interface{}, message string) error {
	return c.Status(code).JSON(APIResponse{
		Status:  "error",
		Message: message,
		Data: data,
	})
}
