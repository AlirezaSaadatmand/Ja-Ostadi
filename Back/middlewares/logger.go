package middleware

import (
	"time"

	"github.com/AlirezaSaadatmand/Ja-Ostadi/pkg/logging"
	"github.com/gofiber/fiber/v2"
)

func RequestLogger(logger logging.Logger) fiber.Handler {
	return func(c *fiber.Ctx) error {

		if c.Path() == "/swagger" || c.Path() == "/docs" {
			return c.Next()
		}

		start := time.Now()
		reqBody := c.Body()

		err := c.Next()

		latency := time.Since(start)

		keys := map[logging.ExtraKey]interface{}{
			logging.Path:        c.Path(),
			logging.Method:      c.Method(),
			logging.StatusCode:  c.Response().StatusCode(),
			logging.ClientIp:    c.IP(),
			logging.Latency:     latency,
			logging.RequestBody: string(reqBody),
			logging.BodySize:    len(c.Response().Body()),
			logging.ErrorMessage: func() string {
				if err != nil {
					return err.Error()
				}
				return ""
			}(),
		}

		logger.Info(logging.RequestResponse, logging.API, "HTTP Request", keys)
		return err
	}
}
