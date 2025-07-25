package config

import (
    "log"
    "os"

    "github.com/joho/godotenv"
)

type Config struct {
    DBUser     string
    DBPassword string
    DBHost     string
    DBPort     string
    DBName     string
}

var appConfig *Config

func LoadConfig() *Config {
    if appConfig != nil {
        return appConfig // already loaded
    }

    if err := godotenv.Load(); err != nil {
        log.Println(".env file not found or cannot be loaded, using system env variables")
    }

    appConfig = &Config{
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
