package scripts

import (
	"encoding/json"
	"fmt"
	"regexp"
	"strings"
	"time"

	"gorm.io/gorm"

	"github.com/AlirezaSaadatmand/Ja-Ostadi/database"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/models"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/types"
)

func ParseAndUpdateFoodWeek(data []byte) (*models.WeekMeals, error) {
	db := database.DB
	raw, err := parseFoodWeekJSON(data)
	if err != nil {
		return nil, err
	}

	week, err := findOrCreateWeek(db, raw.Week)
	if err != nil {
		return nil, err
	}

	if err := updateDaysAndMeals(db, week, raw.Meals); err != nil {
		return nil, err
	}

	fmt.Println("FoodWeek updated successfully at:", time.Now().Format(time.RFC1123))
	return week, nil
}

func parseFoodWeekJSON(data []byte) (*types.FoodWeekJSON, error) {
	var raw types.FoodWeekJSON
	if err := json.Unmarshal(data, &raw); err != nil {
		return nil, fmt.Errorf("failed to parse food week JSON: %w", err)
	}
	return &raw, nil
}

func findOrCreateWeek(db *gorm.DB, weekName string) (*models.WeekMeals, error) {
	var week models.WeekMeals

	if err := db.Where("week = ?", weekName).First(&week).Error; err != nil {
		week = models.WeekMeals{Week: weekName}
		if err := db.Create(&week).Error; err != nil {
			return nil, fmt.Errorf("failed to create week: %w", err)
		}
	} else {
		week.Week = weekName
		if err := db.Save(&week).Error; err != nil {
			return nil, fmt.Errorf("failed to update week: %w", err)
		}
	}
	return &week, nil
}

func updateDaysAndMeals(db *gorm.DB, week *models.WeekMeals, days []types.DayMealJSON) error {
	for _, d := range days {
		dayName, dayDate := parseDayNameAndDate(d.Day)

		day, err := findOrCreateDay(db, week.ID, dayName, dayDate)
		if err != nil {
			return err
		}

		if err := updateMealsForDay(db, day, d); err != nil {
			return err
		}
	}
	return nil
}

func findOrCreateDay(db *gorm.DB, weekID uint, dayName, dayDate string) (*models.DayMeals, error) {
	var day models.DayMeals
	if err := db.Where("week_id = ? AND day = ?", weekID, dayName).First(&day).Error; err != nil {
		day = models.DayMeals{
			WeekID: weekID,
			Day:    dayName,
			Date:   dayDate,
		}
		if err := db.Create(&day).Error; err != nil {
			return nil, fmt.Errorf("failed to create day: %w", err)
		}
	} else {
		day.Date = dayDate
		if err := db.Save(&day).Error; err != nil {
			return nil, fmt.Errorf("failed to update day: %w", err)
		}
	}
	return &day, nil
}

func updateMealsForDay(db *gorm.DB, day *models.DayMeals, d types.DayMealJSON) error {
	meals := append(append(d.Breakfast, d.Lunch...), d.Dinner...)

	for _, m := range meals {
		mealType := determineMealType(d, m)

		place := extractPlace(m.Name)
		cleanName := cleanMealName(m.Name)
		price := strings.TrimSpace(extractPrice(m.Name))

		var meal models.Meal
		if err := db.Where("day_id = ? AND type = ? AND name = ?", day.ID, mealType, cleanName).
			First(&meal).Error; err != nil {

			meal = models.Meal{
				DayID: day.ID,
				Type:  mealType,
				Name:  cleanName,
				Price: price,
				Place: place,
			}

			if err := db.Create(&meal).Error; err != nil {
				return fmt.Errorf("failed to create meal: %w", err)
			}

		} else {
			if err := db.Model(&meal).Updates(models.Meal{
				Price: price,
				Place: place,
			}).Error; err != nil {
				return fmt.Errorf("failed to update meal: %w", err)
			}
		}
	}

	return nil
}

func extractPlace(name string) string {
	start := strings.Index(name, "[")
	end := strings.Index(name, "]")

	if start != -1 && end > start {
		return strings.TrimSpace(name[start+1 : end])
	}

	return "سلف"
}

func determineMealType(d types.DayMealJSON, m types.MealJSON) string {
	if contains(d.Breakfast, m) {
		return "Breakfast"
	} else if contains(d.Dinner, m) {
		return "Dinner"
	}
	return "Lunch"
}

func parseDayNameAndDate(dayField string) (string, string) {
	parts := strings.Fields(dayField)
	if len(parts) == 0 {
		return "", ""
	}
	if len(parts) == 1 {
		return parts[0], ""
	}
	return strings.Join(parts[:len(parts)-1], " "), parts[len(parts)-1]
}

func contains(slice []types.MealJSON, m types.MealJSON) bool {
	for _, item := range slice {
		if item.Name == m.Name {
			return true
		}
	}
	return false
}

func cleanMealName(input string) string {
	re := regexp.MustCompile(`\[.*?\]`)
	cleaned := re.ReplaceAllString(input, "")

	parts := strings.Fields(cleaned)
	if len(parts) > 0 {
		last := parts[len(parts)-1]
		if isNumeric(last) {
			parts = parts[:len(parts)-1]
		}
	}

	return strings.TrimSpace(strings.Join(parts, " "))
}

func extractPrice(input string) string {
	parts := strings.Fields(input)
	if len(parts) == 0 {
		return ""
	}
	last := parts[len(parts)-1]
	if isNumeric(last) {
		return last
	}
	return ""
}

func isNumeric(s string) bool {
	_, err := fmt.Sscanf(s, "%f", new(float64))
	return err == nil
}
