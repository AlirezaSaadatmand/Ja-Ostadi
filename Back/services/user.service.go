package services

import (
	"github.com/AlirezaSaadatmand/Ja-Ostadi/database"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/models"
)

// CheckCourseIDs verifies which IDs exist and which are missing.
func (s *Services) CheckCourseIDs(courseIDs []uint) ([]uint, error) {
	var validIDs []uint
	if err := database.DB.
		Model(&models.Course{}).
		Where("id IN ?", courseIDs).
		Pluck("id", &validIDs).Error; err != nil {
		return nil, err
	}

	// Build map for fast lookup
	validMap := make(map[uint]bool, len(validIDs))
	for _, id := range validIDs {
		validMap[id] = true
	}

	// Collect missing IDs
	var missing []uint
	for _, id := range courseIDs {
		if !validMap[id] {
			missing = append(missing, id)
		}
	}

	return missing, nil
}

// ReplaceUserCourses deletes all existing and inserts new courses for the user.
func (s *Services) ReplaceUserCourses(userID uint, courseIDs []uint) ([]models.UserCourse, error) {
	// Delete old user courses
	if err := database.DB.Where("user_id = ?", userID).Delete(&models.UserCourse{}).Error; err != nil {
		return nil, err
	}

	// Insert new ones
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
