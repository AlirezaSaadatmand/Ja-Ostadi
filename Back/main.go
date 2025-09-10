package main

import (
	"fmt"
	"sync"
	"time"

	"github.com/AlirezaSaadatmand/Ja-Ostadi/config"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/database"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/docs"
	middleware "github.com/AlirezaSaadatmand/Ja-Ostadi/middlewares"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/pkg/limiter"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/pkg/logging"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/routes"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)


func main() {
	config.LoadConfig()
	cfg := config.GetConfig()
	logger := logging.NewLogger()

	logger.Info(logging.General, logging.Startup, "Configuration loaded successfully", map[logging.ExtraKey]interface{}{
		"MODE": cfg.MODE,
		"HOST": cfg.HOST,
		"PORT": cfg.PORT,
	})

	database.ConnectDB(logger)

	app := fiber.New()

	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowHeaders: "Origin, Content-Type, Accept, Authorization, X-Admin-Token",
	}))

	app.Use(middleware.RequestLogger(logger))

	buckets := make(map[string]*limiter.TokenBucket)
	var mu sync.Mutex

	app.Use(func(c *fiber.Ctx) error {
		ip := c.IP()

		mu.Lock()
		bucket, ok := buckets[ip]
		if !ok {
			bucket = limiter.NewTokenBucket(5, 1, time.Second)
			buckets[ip] = bucket
		}
		mu.Unlock()
		if !bucket.Allow() {
			return c.Status(429).JSON(fiber.Map{
				"error": "Too many requests, slow down!",
			})
		}
		return c.Next()
	})

	app.Get("/", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"message": "Welcome to Ja Ostadi API!",
		})
	})

	docs.SetupSwagger(app)
	routes.Router(app, logger)

	if err := app.Listen(fmt.Sprintf(":%s", cfg.PORT)); err != nil {
		logger.Fatal(logging.General, logging.Startup, "Failed to start server", map[logging.ExtraKey]interface{}{"error": err})
	}
}
