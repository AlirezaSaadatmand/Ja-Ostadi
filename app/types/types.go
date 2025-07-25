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
	FinalExamTime  string `json:"final_exam_time"`
	Capacity       string `json:"capacity"`
	StudentCount   string `json:"student_count"`
}
