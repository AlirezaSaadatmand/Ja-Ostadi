package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	MODE               string
	HOST               string
	PORT               string
	DBUser             string
	DBPassword         string
	DBHost             string
	DBPort             string
	DBName             string
	Logger             string
	AdminToken         string
	GoogleClientID     string
	GoogleClientSecret string
	Secret_Token       string
	Front_URL          string
}

var appConfig *Config

func LoadConfig() *Config {
	if appConfig != nil {
		return appConfig
	}

	if err := godotenv.Load(); err != nil {
		log.Println(".env file not found or cannot be loaded, using system env variables")
	}

	appConfig = &Config{
		MODE:               os.Getenv("MODE"),
		HOST:               os.Getenv("HOST"),
		PORT:               os.Getenv("PORT"),
		DBUser:             os.Getenv("DB_USER"),
		DBPassword:         os.Getenv("DB_PASSWORD"),
		DBHost:             os.Getenv("DB_HOST"),
		DBPort:             os.Getenv("DB_PORT"),
		DBName:             os.Getenv("DB_NAME"),
		Logger:             os.Getenv("LOGGER"),
		AdminToken:         os.Getenv("ADMIN_TOKEN"),
		GoogleClientID:     os.Getenv("GOOGLE_CLIENT_ID"),
		GoogleClientSecret: os.Getenv("GOOGLE_CLIENT_SECRET"),
		Secret_Token:       os.Getenv("TOKEN_SECRET"),
		Front_URL:       os.Getenv("FRONT_URL"),
	}

	return appConfig
}

func GetConfig() *Config {
	if appConfig == nil {
		return LoadConfig()
	}
	return appConfig
}
