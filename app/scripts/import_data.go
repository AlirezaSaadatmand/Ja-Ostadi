package scripts

import (
	"encoding/json"
	"errors"
	"fmt"
	"os"
	"strconv"
	"strings"

	"github.com/AlirezaSaadatmand/Ja-Ostadi/database"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/models"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/types"
	"gorm.io/gorm"
)

// Load JSON from file
func loadJSON(path string) ([]types.CourseJSON, error) {
	data, err := os.ReadFile(path)
	if err != nil {
		return nil, fmt.Errorf("failed to read file: %w", err)
	}
	var rawCourses []types.CourseJSON
	if err := json.Unmarshal(data, &rawCourses); err != nil {
		return nil, fmt.Errorf("failed to unmarshal JSON: %w", err)
	}
	return rawCourses, nil
}

func getOrCreateSemester(name string) (models.Semester, error) {
	db := database.DB
	var semester models.Semester
	err := db.FirstOrCreate(&semester, models.Semester{Name: name}).Error
	return semester, err
}

func getOrCreateDepartment(item types.CourseJSON) (models.Department, error) {
	db := database.DB
	name := item.Department
	var dept models.Department
	err := db.Where("name = ?", name).First(&dept).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			dept = models.Department{Name: name}
			err = db.Create(&dept).Error
		}
	}
	return dept, err
}

func parseInstructorNameAndField(raw string) (string, string) {
	parts := strings.Split(raw, "*")
	var name, field string
	if len(parts) >= 2 {
		name = strings.TrimSpace(parts[1] + " " + parts[0])
		if len(parts) >= 3 {
			fieldPart := strings.TrimSpace(parts[2])
			if idx := strings.Index(fieldPart, "("); idx != -1 {
				field = strings.TrimSpace(fieldPart[:idx])
			} else {
				field = fieldPart
			}
		}
	} else if len(parts) == 1 {
		name = strings.TrimSpace(parts[0])
	} else {
		name = "نامعلوم"
		field = "نامشخص"
	}
	return name, field
}

func getOrCreateInstructor(item types.CourseJSON) (models.Instructor, error) {
	db := database.DB
	raw := item.Instructor
	name, field := parseInstructorNameAndField(raw)

	var instructor models.Instructor
	err := db.Where("name = ?", name).First(&instructor).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			// Create new instructor if not found
			instructor = models.Instructor{
				Name:  name,
				Field: field,
			}
			err = db.Create(&instructor).Error
		}
	}

	return instructor, err
}

func getOrCreateInstructorDepartment(instructorID, departmentID uint) (models.InstructorDepartment, error) {
	db := database.DB

	var rel models.InstructorDepartment
	err := db.Where("instructor_id = ? AND department_id = ?", instructorID, departmentID).First(&rel).Error

	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			rel = models.InstructorDepartment{
				InstructorID: instructorID,
				DepartmentID: departmentID,
			}
			err = db.Create(&rel).Error
		}
	}
	return rel, err
}

func createCourse(item types.CourseJSON, semester models.Semester, dept models.Department, instructor models.Instructor) error {
	db := database.DB

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

	return db.Create(&course).Error
}

func ImportData() error {
	db := database.DB
	var count int64
	db.Model(&models.Course{}).Count(&count)
	if count > 0 {
		fmt.Println("⚠️ Data already exists in the database. Skipping import.")
		return nil
	}

	rawCourses, err := loadJSON("./data/data.json")
	if err != nil {
		return err
	}

	for _, item := range rawCourses {
		semester, err := getOrCreateSemester(item.Semester)
		if err != nil {
			return err
		}

		dept, err := getOrCreateDepartment(item)
		if err != nil {
			return err
		}

		instructor, err := getOrCreateInstructor(item)
		if err != nil {
			return err
		}

		_, err = getOrCreateInstructorDepartment(instructor.ID, dept.ID)
		if err != nil {
			return err // or handle the error
		}

		err = createCourse(item, semester, dept, instructor)
		if err != nil {
			return err
		}
	}

	fmt.Println("✅ Data import completed.")
	return nil
}
