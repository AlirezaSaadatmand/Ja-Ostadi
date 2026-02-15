package database

import (
	"fmt"

	"github.com/AlirezaSaadatmand/Ja-Ostadi/config"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/models"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/pkg/logging"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

func ConnectDB(zapLogger logging.Logger) error {
	cfg := config.GetConfig()

	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?parseTime=true&charset=utf8mb4&loc=Local",
		cfg.DBUser,
		cfg.DBPassword,
		cfg.DBHost,
		cfg.DBPort,
		cfg.DBName,
	)

	gormLogger := logger.Default.LogMode(logger.Error)

	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{
		Logger: gormLogger,
	})
	if err != nil {
		zapLogger.Fatal(logging.Mysql, logging.Connection, "Failed to connect to database", map[logging.ExtraKey]interface{}{"error": err})
		return fmt.Errorf("failed to connect to database: %w", err)
	}
	zapLogger.Info(logging.Mysql, logging.Connection, "Database connection established", nil)

	if err := db.AutoMigrate(
		&models.UserCourse{},
		&models.User{},
		&models.Base_course_data{},
		&models.Semester{},
		&models.Department{},
		&models.Instructor{},
		&models.Course{},
		&models.InstructorDepartment{},
		&models.ClassTime{},
		&models.WeekMeals{},
		&models.DayMeals{},
		&models.Meal{},
		&models.RateMeal{},
		&models.Class{},
		&models.Client{},
		&models.TempCourse{},
		&models.Contributor{},
	); err != nil {
		zapLogger.Fatal(logging.Mysql, logging.Migration, "Failed to auto-migrate models", map[logging.ExtraKey]interface{}{"error": err})
		return fmt.Errorf("failed to auto-migrate models: %w", err)
	}
	zapLogger.Info(logging.Mysql, logging.Migration, "Auto-migration completed successfully", nil)

	DB = db // <-- RIGHT AFTER THIS LINE

	// // ADD THE CONNECTION POOLING HERE:
	// sqlDB, err := db.DB()
	// if err != nil {
	// 	zapLogger.Fatal(logging.Mysql, logging.Connection, "Failed to get sql.DB", map[logging.ExtraKey]interface{}{"error": err})
	// 	return fmt.Errorf("failed to get sql.DB: %w", err)
	// }
	// sqlDB.SetMaxIdleConns(20)
	// sqlDB.SetMaxOpenConns(100)
	// sqlDB.SetConnMaxLifetime(24 * time.Hour) // Add import "time" at top if missing

	// zapLogger.Info(logging.Mysql, logging.Connection, "Connection pool configured", nil)

	return nil // <-- BEFORE THIS RETURN
}
