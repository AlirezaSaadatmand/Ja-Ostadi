package services

import (
	"errors"

	"github.com/AlirezaSaadatmand/Ja-Ostadi/database"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/models"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/types"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/pkg/logging"
	"gorm.io/gorm"
)

func (s *Services) CreateTempCourse(DirectorID string, req types.TempCourseRequest) (*models.TempCourse, error) {
	var client models.Client
	err := database.DB.Where("id = ?", DirectorID).First(&client).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			s.Logger.Warn(logging.Auth, logging.Verify, "Client not found", map[logging.ExtraKey]interface{}{
				"DirectorID": DirectorID,
			})
			return nil, errors.New("client not found")
		}
		s.Logger.Error(logging.Mysql, logging.Select, "Failed to retrieve client", map[logging.ExtraKey]interface{}{
			"DirectorID": DirectorID,
			"error":      err.Error(),
		})
		return nil, errors.New("database error")
	}

	tempCourse := models.TempCourse{
		Department:    req.Department,
		CourseName:    req.CourseName,
		Group:         req.Group,
		Units:         req.Units,
		Instructor:    req.Instructor,
		FirstRoom:     req.FirstRoom,
		FirstDay:      req.FirstDay,
		FirstTime:     req.FirstTime,
		SecondRoom:    req.SecondRoom,
		SecondDay:     req.SecondDay,
		SecondTime:    req.SecondTime,
		FinalExamTime: req.FinalExamTime,
		FinalExamDate: req.FinalExamDate,
		DirectorID:   DirectorID,
	}

	err = database.DB.Create(&tempCourse).Error
	if err != nil {
		s.Logger.Error(logging.Mysql, logging.Insert, "Failed to create temp course", map[logging.ExtraKey]interface{}{
			"DirectorID": DirectorID,
			"courseName": req.CourseName,
			"error":      err.Error(),
		})
		return nil, errors.New("failed to create temp course")
	}

	s.Logger.Info(logging.TempCourse, logging.Create, "Temp course created successfully", map[logging.ExtraKey]interface{}{
		"tempCourseID": tempCourse.ID,
		"DirectorID":   DirectorID,
		"courseName":   req.CourseName,
	})

	return &tempCourse, nil
}



func (s *Services) UpdateTempCourse(DirectorID string, id uint, req types.TempCourseUpdateRequest) (*models.TempCourse, error) {
	var tempCourse models.TempCourse

	err := database.DB.Where("id = ? AND director_id = ?", id, DirectorID).First(&tempCourse).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			s.Logger.Warn(logging.TempCourse, logging.Update, "Temp course not found for update", map[logging.ExtraKey]interface{}{
				"tempCourseID": id,
				"DirectorID":   DirectorID,
			})
			return nil, errors.New("temp course not found")
		}
		s.Logger.Error(logging.Mysql, logging.Select, "Failed to find temp course for update", map[logging.ExtraKey]interface{}{
			"tempCourseID": id,
			"DirectorID":   DirectorID,
			"error":        err.Error(),
		})
		return nil, errors.New("database error")
	}

	if req.Department != "" {
		tempCourse.Department = req.Department
	}
	if req.CourseName != "" {
		tempCourse.CourseName = req.CourseName
	}
	if req.Group != "" {
		tempCourse.Group = req.Group
	}
	if req.Units != "" {
		tempCourse.Units = req.Units
	}
	if req.Instructor != "" {
		tempCourse.Instructor = req.Instructor
	}
	if req.TargetTerm != "" {
		tempCourse.TargetTerm = req.TargetTerm
	}
	if req.FirstRoom != "" {
		tempCourse.FirstRoom = req.FirstRoom
	}
	if req.FirstDay != "" {
		tempCourse.FirstDay = req.FirstDay
	}
	if req.FirstTime != "" {
		tempCourse.FirstTime = req.FirstTime
	}
	if req.FirstLock != nil {
		tempCourse.FirstLock = *req.FirstLock
	}
	if req.SecondRoom != "" {
		tempCourse.SecondRoom = req.SecondRoom
	}
	if req.SecondDay != "" {
		tempCourse.SecondDay = req.SecondDay
	}
	if req.SecondTime != "" {
		tempCourse.SecondTime = req.SecondTime
	}
	if req.SecondLock != nil {
		tempCourse.SecondLock = *req.SecondLock
	}
	if req.FinalExamTime != "" {
		tempCourse.FinalExamTime = req.FinalExamTime
	}
	if req.FinalExamDate != "" {
		tempCourse.FinalExamDate = req.FinalExamDate
	}

	err = database.DB.Save(&tempCourse).Error
	if err != nil {
		s.Logger.Error(logging.Mysql, logging.Update, "Failed to update temp course", map[logging.ExtraKey]interface{}{
			"tempCourseID": id,
			"DirectorID":   DirectorID,
			"error":        err.Error(),
		})
		return nil, errors.New("failed to update temp course")
	}

	s.Logger.Info(logging.TempCourse, logging.Update, "Temp course updated successfully", map[logging.ExtraKey]interface{}{
		"tempCourseID": id,
		"DirectorID":   DirectorID,
	})

	return &tempCourse, nil
}

func (s *Services) DeleteTempCourse(DirectorID string, id uint) error {
	result := database.DB.Where("id = ? AND clients_id = ?", id, DirectorID).Delete(&models.TempCourse{})
	if result.Error != nil {
		s.Logger.Error(logging.Mysql, logging.Delete, "Failed to delete temp course", map[logging.ExtraKey]interface{}{
			"tempCourseID": id,
			"DirectorID":   DirectorID,
			"error":        result.Error.Error(),
		})
		return errors.New("failed to delete temp course")
	}

	if result.RowsAffected == 0 {
		s.Logger.Warn(logging.TempCourse, logging.Delete, "Temp course not found for deletion", map[logging.ExtraKey]interface{}{
			"tempCourseID": id,
			"DirectorID":   DirectorID,
		})
		return errors.New("temp course not found")
	}

	s.Logger.Info(logging.TempCourse, logging.Delete, "Temp course deleted successfully", map[logging.ExtraKey]interface{}{
		"tempCourseID": id,
		"DirectorID":   DirectorID,
	})

	return nil
}


func (s *Services) GetTempCourses(DirectorID string) ([]models.TempCourse, error) {
	var tempCourses []models.TempCourse

	db := database.DB.Model(&models.TempCourse{}).Where("clients_id = ?", DirectorID)
	err := db.Find(&tempCourses).Error
	if err != nil {
		s.Logger.Error(logging.Mysql, logging.Select, "Failed to retrieve temp courses", map[logging.ExtraKey]interface{}{
			"DirectorID": DirectorID,
			"error":      err.Error(),
		})
		return nil,errors.New("failed to retrieve temp courses")
	}

	s.Logger.Info(logging.TempCourse, logging.Select, "Temp courses retrieved", map[logging.ExtraKey]interface{}{
		"DirectorID": DirectorID,
		"count":      len(tempCourses),
	})

	return tempCourses, nil
}