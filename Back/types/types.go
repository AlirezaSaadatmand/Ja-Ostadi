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
	Commented    bool    `json:"commented"`
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
	MealID  int    `json:"mealId"`
	Rating  int    `json:"rating"`
	Comment string `json:"comment"`
}

type RegisterClientRequest struct {
	Username string `json:"username" validate:"required,min=3,max=50"`
	Password string `json:"password" validate:"required,min=8"`
	Role     string `json:"role"`
}

type UpdateClientRequest struct {
	Username string `json:"username,omitempty"`
	Password string `json:"password,omitempty"`
	Role     string `json:"role,omitempty"`
}

type LoginRequest struct {
	Username string `json:"username" validate:"required"`
	Password string `json:"password" validate:"required"`
}

type TempCourseRequest struct {
	Department string `json:"department" validate:"required"`
	CourseName string `json:"courseName" validate:"required"`
	Group      string `json:"group" validate:"required"`
	Units      string `json:"units" validate:"required"`
	Instructor string `json:"instructor"`
	TargetTerm string `json:"targetTerm" validate:"required"`

	FirstRoom string `json:"firstRoom"`
	FirstDay  string `json:"firstDay"`
	FirstTime string `json:"firstTime"`
	FirstLock bool   `json:"firstLock"`

	SecondRoom string `json:"secondRoom"`
	SecondDay  string `json:"secondDay"`
	SecondTime string `json:"secondTime"`
	SecondLock bool   `json:"secondLock"`

	FinalExamTime string `json:"finalExamTime"`
	FinalExamDate string `json:"finalExamDate"`
}

type TempCourseUpdateRequest struct {
	Department string `json:"department"`
	CourseName string `json:"courseName"`
	Group      string `json:"group"`
	Units      string `json:"units"`
	Instructor string `json:"instructor"`
	TargetTerm string `json:"targetTerm"`

	FirstRoom string `json:"firstRoom"`
	FirstDay  string `json:"firstDay"`
	FirstTime string `json:"firstTime"`
	FirstLock *bool  `json:"firstLock"`

	SecondRoom string `json:"secondRoom"`
	SecondDay  string `json:"secondDay"`
	SecondTime string `json:"secondTime"`
	SecondLock *bool  `json:"secondLock"`

	FinalExamTime string `json:"finalExamTime"`
	FinalExamDate string `json:"finalExamDate"`
}

type GithubContributor struct {
	Login         string `json:"login"`
	Avatar_url    string `json:"avatar_url"`
	Html_url      string `json:"html_url"`
	Contributions int    `json:"contributions"`
	Type          string `json:"type"`
}