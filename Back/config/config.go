package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	MODE       string
	HOST       string
	PORT       string
	DBUser     string
	DBPassword string
	DBHost     string
	DBPort     string
	DBName     string
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
		MODE:       os.Getenv("MODE"),
		HOST:       os.Getenv("HOST"),
		PORT:       os.Getenv("PORT"),
		DBUser:     os.Getenv("DB_USER"),
		DBPassword: os.Getenv("DB_PASSWORD"),
		DBHost:     os.Getenv("DB_HOST"),
		DBPort:     os.Getenv("DB_PORT"),
		DBName:     os.Getenv("DB_NAME"),
	}

	return appConfig
}

func GetConfig() *Config {
	if appConfig == nil {
		return LoadConfig()
	}
	return appConfig
}
