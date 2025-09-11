package types

type CourseJSON struct {
	Semester       string `json:"semester"`
	Department     string `json:"department"`
	CourseName     string `json:"course_name"`
	CourseNumber   string `json:"course_number"`
	Group          string `json:"group"`
	Units          string `json:"units"`
	ClassType      string `json:"class_type"`
	Instructor     string `json:"instructor"`
	TimeInWeek     string `json:"time_in_week"`
	TimeRoom       string `json:"time_room"`
	MidExamTime    string `json:"mid_exam_time"`
	FinalExamDate string `json:"final_exam_date"`
	Capacity       string `json:"capacity"`
	StudentCount   string `json:"student_count"`
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