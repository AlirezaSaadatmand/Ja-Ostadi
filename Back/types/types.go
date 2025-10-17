package types

type CourseJSON struct {
	Semester      string `json:"semester"`
	Department    string `json:"department"`
	CourseName    string `json:"course_name"`
	CourseNumber  string `json:"course_number"`
	Group         string `json:"group"`
	Units         string `json:"units"`
	ClassType     string `json:"class_type"`
	Instructor    string `json:"instructor"`
	TimeInWeek    string `json:"time_in_week"`
	TimeRoom      string `json:"time_room"`
	FinalExamTime string `json:"final_exam_time"`
	FinalExamDate string `json:"final_exam_date"`
	Capacity      string `json:"capacity"`
	StudentCount  string `json:"student_count"`
}

type GoogleUser struct {
	ID            string `json:"id"`
	Email         string `json:"email"`
	VerifiedEmail bool   `json:"verified_email"`
	Name          string `json:"name"`
	GivenName     string `json:"given_name"`
	FamilyName    string `json:"family_name"`
	Picture       string `json:"picture"`
	Locale        string `json:"locale"`
}

type FoodWeekJSON struct {
	Week  string        `json:"week"`
	Meals []DayMealJSON `json:"meals"`
}

type DayMealJSON struct {
	Day       string     `json:"day"`
	Breakfast []MealJSON `json:"breakfast"`
	Lunch     []MealJSON `json:"lunch"`
	Dinner    []MealJSON `json:"dinner"`
}

type MealJSON struct {
	Name string `json:"name"`
}

type MealData struct {
	ID           string  `json:"id"`
	Name         string  `json:"name"`
	Price        string  `json:"price"`
	Rating       float32 `json:"rating"`
	Description  string  `json:"description"`
	Place        string  `json:"place"`
	ImageAddress string  `json:"imageAddress"`
}

type DayFoodData struct {
	Day       string     `json:"day"`
	Date      string     `json:"date"`
	Breakfast []MealData `json:"breakfast"`
	Lunch     []MealData `json:"lunch"`
	Dinner    []MealData `json:"dinner"`
}

type FoodData struct {
	Week  string        `json:"week"`
	Meals []DayFoodData `json:"meals"`
}

type SubmitRatingRequest struct {
	MealID  uint   `json:"meal_id"`
	Rating  int    `json:"rating"`
	Comment string `json:"comment"`
}