package database

import (
	"fmt"

	"github.com/AlirezaSaadatmand/Ja-Ostadi/config"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/models"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDB() error {
	cfg := config.GetConfig()

	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?parseTime=true&charset=utf8mb4&loc=Local",
		cfg.DBUser,
		cfg.DBPassword,
		cfg.DBHost,
		cfg.DBPort,
		cfg.DBName,
	)

	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		return err
	}

	// Auto-migrate all models
	err = db.AutoMigrate(
		&models.Semester{},
		&models.Department{},
		&models.Instructor{},
		&models.Course{},
		&models.ClassTime{},
	)
	if err != nil {
		return err
	}

	DB = db
	return nil
}
