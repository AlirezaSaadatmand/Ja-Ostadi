package scripts

import (
	"encoding/json"
	"fmt"
	"os"
	"strconv"
	"strings"

	"github.com/AlirezaSaadatmand/Ja-Ostadi/database"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/models"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/types"
)

func ImportData() error {
	var count int64
	database.DB.Model(&models.Course{}).Count(&count)
	if count > 0 {
		fmt.Println("⚠️ Data already exists in the database. Skipping import.")
		return nil
	}
	db := database.DB
	path := "./data/data.json"

	data, err := os.ReadFile(path)
	if err != nil {
		return fmt.Errorf("failed to read file: %w", err)
	}

	var rawCourses []types.CourseJSON
	if err := json.Unmarshal(data, &rawCourses); err != nil {
		return fmt.Errorf("failed to unmarshal JSON: %w", err)
	}

	for _, item := range rawCourses {
		var semester models.Semester
		db.FirstOrCreate(&semester, models.Semester{Name: item.Semester})

		var dept models.Department
		db.FirstOrCreate(&dept, models.Department{Name: item.Department})

		parts := strings.Split(item.Instructor, "*")
		var instructorName string
		if len(parts) >= 2 {
			instructorName = strings.TrimSpace(parts[1] + " " + parts[0])
		} else if len(parts) == 1 {
			instructorName = strings.TrimSpace(parts[0])
		} else {
			instructorName = "نامعلوم"
		}

		var instructor models.Instructor
		db.FirstOrCreate(&instructor, models.Instructor{Name: instructorName})

		units, _ := strconv.Atoi(item.Units)
		capacity, _ := strconv.Atoi(item.Capacity)
		studentCount, _ := strconv.Atoi(item.StudentCount)

		course := models.Course{
			Name:          item.CourseName,
			Number:        item.CourseNumber,
			Group:         item.Group,
			Units:         units,
			ClassType:     item.ClassType,
			TimeInWeek:    item.TimeInWeek,
			TimeRoom:      item.TimeRoom,
			MidExamTime:   item.MidExamTime,
			FinalExamTime: item.FinalExamTime,
			Capacity:      capacity,
			StudentCount:  studentCount,
			SemesterID:    semester.ID,
			DepartmentID:  dept.ID,
			InstructorID:  instructor.ID,
		}

		db.FirstOrCreate(&course, models.Course{Number: course.Number})

		lines := strings.Split(item.TimeRoom, "\n")
		for _, line := range lines {
			line = strings.TrimSpace(line)
			if line == "" {
				continue
			}

			parts := strings.SplitN(line, "-", 2)
			if len(parts) != 2 {
				continue
			}
			day := parts[0]
			timeAndRoom := parts[1]

			timeParts := strings.SplitN(timeAndRoom, "(", 2)
			if len(timeParts) != 2 {
				continue
			}
			room := strings.TrimRight(timeParts[1], ")")

			times := strings.Split(timeParts[0], ":")
			if len(times) < 4 {
				continue
			}
			startTime := times[0] + ":" + times[1]
			endTime := times[2] + ":" + times[3]

			classTime := models.ClassTime{
				Day:       day,
				StartTime: startTime,
				EndTime:   endTime,
				Room:      room,
				CourseID:  course.ID,
			}

			db.Create(&classTime)
		}
	}

	return nil
}
