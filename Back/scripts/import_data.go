package scripts

import (
	"errors"
	"strings"

	"github.com/AlirezaSaadatmand/Ja-Ostadi/database"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/helpers"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/models"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/types"
	"gorm.io/gorm"
)

func addOrUpdateBaseCourse(inputCourse types.CourseJSON) error {
	db := database.DB
	var course models.Base_course_data

	result := db.Where("course_number = ? AND `group` = ? AND semester = ? AND department = ?", inputCourse.CourseNumber, inputCourse.Group, inputCourse.Semester, inputCourse.Department).First(&course)
	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			course = models.Base_course_data{
				CourseNumber:  inputCourse.CourseNumber,
				CourseName:    inputCourse.CourseName,
				Semester:      inputCourse.Semester,
				Department:    inputCourse.Department,
				Group:         inputCourse.Group,
				Units:         inputCourse.Units,
				ClassType:     inputCourse.ClassType,
				Instructor:    inputCourse.Instructor,
				TimeInWeek:    inputCourse.TimeInWeek,
				TimeRoom:      inputCourse.TimeRoom,
				FinalExamTime: inputCourse.FinalExamTime,
				FinalExamDate: inputCourse.FinalExamDate,
				Capacity:      inputCourse.Capacity,
				StudentCount:  inputCourse.StudentCount,
			}
			if err := db.Create(&course).Error; err != nil {
				return err
			}
		} else {
			return result.Error
		}
	} else {
		course.CourseName = inputCourse.CourseName
		course.Semester = inputCourse.Semester
		course.Department = inputCourse.Department
		course.Group = inputCourse.Group
		course.Units = inputCourse.Units
		course.ClassType = inputCourse.ClassType
		course.Instructor = inputCourse.Instructor
		course.TimeInWeek = inputCourse.TimeInWeek
		course.TimeRoom = inputCourse.TimeRoom
		course.FinalExamTime = inputCourse.FinalExamTime
		course.FinalExamDate = inputCourse.FinalExamDate
		course.Capacity = inputCourse.Capacity
		course.StudentCount = inputCourse.StudentCount

		if err := db.Save(&course).Error; err != nil {
			return err
		}
	}

	return nil
}

func getOrCreateSemester(name string) (models.Semester, error) {
	db := database.DB
	var semester models.Semester
	err := db.FirstOrCreate(&semester, models.Semester{Name: name}).Error
	return semester, err
}

func getOrCreateDepartment(item types.CourseJSON) (models.Department, error) {
	db := database.DB
	name := helpers.NormalizePersian(item.Department)
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

	return helpers.NormalizePersian(name), helpers.NormalizePersian(field)
}

func getOrCreateInstructor(item types.CourseJSON) (models.Instructor, error) {
	db := database.DB
	raw := item.Instructor
	name, field := parseInstructorNameAndField(raw)

	var instructor models.Instructor
	err := db.Where("name = ? AND field = ?", name, field).First(&instructor).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			instructor = models.Instructor{
				Name:  name,
				Field: field,
			}
			err = db.Create(&instructor).Error
		}
	}

	return instructor, err
}

func getOrCreateInstructorDepartment(instructorID, departmentID, semesterID uint) (models.InstructorDepartment, error) {
	db := database.DB

	var rel models.InstructorDepartment
	err := db.Where("instructor_id = ? AND department_id = ? AND semester_id = ?", instructorID, departmentID, semesterID).First(&rel).Error

	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			rel = models.InstructorDepartment{
				InstructorID: instructorID,
				DepartmentID: departmentID,
				SemesterID:   semesterID,
			}
			err = db.Create(&rel).Error
		}
	}
	return rel, err
}

func createOrUpdateCourse(item types.CourseJSON, semester models.Semester, dept models.Department, instructor models.Instructor) (models.Course, error) {
	db := database.DB

	var course models.Course
	err := db.Where("number = ? AND `group` = ? AND semester_id = ? AND department_id = ?", item.CourseNumber, item.Group, semester.ID, dept.ID).First(&course).Error

	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return course, err
	}

	course.Name = item.CourseName
	course.Number = item.CourseNumber
	course.Group = item.Group
	course.Units = item.Units
	course.ClassType = item.ClassType
	course.TimeInWeek = item.TimeInWeek
	course.TimeRoom = item.TimeRoom
	course.FinalExamTime = item.FinalExamTime
	course.FinalExamDate = item.FinalExamDate
	course.Capacity = item.Capacity
	course.StudentCount = item.StudentCount
	course.SemesterID = semester.ID
	course.DepartmentID = dept.ID
	course.InstructorID = instructor.ID

	if errors.Is(err, gorm.ErrRecordNotFound) {
		err = db.Create(&course).Error
	} else {
		err = db.Save(&course).Error
	}

	return course, err
}

func createOrUpdateClassTime(item types.CourseJSON, course models.Course) error {
	db := database.DB

	if err := db.Where("course_id = ?", course.ID).Delete(&models.ClassTime{}).Error; err != nil {
		return err
	}

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

		if err := db.Create(&classTime).Error; err != nil {
			return err
		}
	}

	return nil
}

func SaveData(rawCourses []types.CourseJSON) error {

	for _, item := range rawCourses {

		err := addOrUpdateBaseCourse(item)
		if err != nil {
			return err
		}

		semester, err := getOrCreateSemester(helpers.NormalizePersian(item.Semester))
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

		_, err = getOrCreateInstructorDepartment(instructor.ID, dept.ID, semester.ID)
		if err != nil {
			return err
		}

		course, err := createOrUpdateCourse(item, semester, dept, instructor)
		if err != nil {
			return err
		}
		err = createOrUpdateClassTime(item, course)
		if err != nil {
			return err
		}
	}
	return nil
}
