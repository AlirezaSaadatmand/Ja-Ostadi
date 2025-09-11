package services

import (
	"github.com/AlirezaSaadatmand/Ja-Ostadi/database"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/models"
)

func (s *Services) SaveUserCourses(userID uint, courseIDs []uint) ([]models.UserCourse, error) {
	if err := database.DB.Where("user_id = ?", userID).Delete(&models.UserCourse{}).Error; err != nil {
		return nil, err
	}

	userCourses := make([]models.UserCourse, 0, len(courseIDs))

	for _, courseID := range courseIDs {
		userCourses = append(userCourses, models.UserCourse{
			UserID:   userID,
			CourseID: courseID,
		})
	}

	if err := database.DB.Create(&userCourses).Error; err != nil {
		return nil, err
	}

	return userCourses, nil
}
