package middleware

import (
	"fmt"
	"strings"
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
		reqBody := ""

		contentType := c.Get("Content-Type")

		if strings.HasPrefix(contentType, "multipart/form-data") ||
			strings.Contains(c.Path(), "/image") ||
			strings.Contains(c.Path(), "/update/data") {
			reqBody = "[binary data omitted]"
		} else {
			reqBody = string(c.Body())
		}

		err := c.Next()
		latency := time.Since(start)
		latencyStr := latency.String()

		keys := map[logging.ExtraKey]interface{}{
			logging.Path:          c.Path(),
			logging.Method:        c.Method(),
			logging.StatusCode:    c.Response().StatusCode(),
			logging.ClientIp:      c.IP(),
			logging.Latency:       latencyStr,
			logging.LatencyMicros: latency.Microseconds(),
			logging.RequestBody:   reqBody,
			logging.BodySize:      len(c.Response().Body()),
			logging.ErrorMessage:  "",
		}

		if err != nil {
			keys[logging.ErrorMessage] = err.Error()
		}

		logger.Info(logging.RequestResponse, logging.API, fmt.Sprintf("HTTP Request (took %s)", latencyStr), keys)
		return err
	}
}
