package services

import (
	"errors"

	"github.com/AlirezaSaadatmand/Ja-Ostadi/database"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/models"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/types"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/pkg/logging"
	"gorm.io/gorm"
)

func (s *Services) CreateTempCourse(directorID string, req types.TempCourseRequest) (*models.TempCourse, error) {
	var director models.DepartmentDirector
	err := database.DB.Where("id = ?", directorID).First(&director).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			s.Logger.Warn(logging.Auth, logging.Verify, "Director not found", map[logging.ExtraKey]interface{}{
				"directorID": directorID,
			})
			return nil, errors.New("director not found")
		}
		s.Logger.Error(logging.Mysql, logging.Select, "Failed to retrieve director", map[logging.ExtraKey]interface{}{
			"directorID": directorID,
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
		DirectorsID:   directorID,
	}

	err = database.DB.Create(&tempCourse).Error
	if err != nil {
		s.Logger.Error(logging.Mysql, logging.Insert, "Failed to create temp course", map[logging.ExtraKey]interface{}{
			"directorID": directorID,
			"courseName": req.CourseName,
			"error":      err.Error(),
		})
		return nil, errors.New("failed to create temp course")
	}

	s.Logger.Info(logging.TempCourse, logging.Create, "Temp course created successfully", map[logging.ExtraKey]interface{}{
		"tempCourseID": tempCourse.ID,
		"directorID":   directorID,
		"courseName":   req.CourseName,
	})

	return &tempCourse, nil
}
