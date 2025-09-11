package main

import (
	"encoding/json"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/go-rod/rod"
	"github.com/go-rod/rod/lib/launcher"
	"github.com/joho/godotenv"
)

type ClassData struct {
	ID            int    `json:"id"`
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

func main() {
	os.Remove("data.json")
	_ = godotenv.Load()

	url := launcher.New().
		Headless(true).
		MustLaunch()

	browser := rod.New().ControlURL(url).MustConnect()
	defer browser.MustClose()

	page := loginAndNavigate(browser)

	semester := os.Getenv("EDSEMESTER")
	departments := page.MustElements("#edDepartment option")
	var id = 0
	for deptIndex := range departments {

		departments := page.MustElements("#edDepartment option")

		deptVal := departments[deptIndex].MustProperty("value").String()
		deptText := departments[deptIndex].MustText()

		println(deptVal, deptText)
		if deptVal == "" || deptVal == "0" {
			continue
		}

		fmt.Printf("🏛️ Department [%d]: %s (%s)\n", deptIndex, deptText, deptVal)

		println(semester, deptText)
		page.MustElement("#edSemester").MustSelect(semester)
		page.MustElement("#edDepartment").MustSelect(deptText)

		page.MustElement("#edDisplay").MustClick()
		page.MustWaitLoad()

		rows := getTargetRows(page)
		if len(rows) == 0 {
			fmt.Println("❌ No course rows found.")
			continue
		}

		for rowIndex := 3; rowIndex < len(rows); rowIndex++ {
			fmt.Printf("📚 [Dept: %s] Processing row %d\n", deptText, rowIndex)
			ok := processRow(page, rowIndex, id)
			if ok {
				id++
			}
		}
	}

	fmt.Println("✅ All departments and courses processed.")
}

func loginAndNavigate(browser *rod.Browser) *rod.Page {
	fmt.Println("🌐 Opening login page...")
	page := browser.MustPage(os.Getenv("URL"))
	page.MustWaitLoad()

	fmt.Println("🔑 Filling credentials...")
	page.MustElement("#edId").MustInput(os.Getenv("USE"))
	page.MustElement("#edPass").MustInput(os.Getenv("PASSWORD"))
	page.MustElement("#edEnter").MustClick()

	page.MustWaitLoad()
	fmt.Println("📦 Clicking dashboard menu...")
	page.MustElement(`div[class="small-box bg-gray btn"]`).MustClick()

	fmt.Println("⚙️ Waiting before performing JS action...")
	time.Sleep(2 * time.Second)

	fmt.Println("🧪 Evaluating PerformStd('Pcl') JS...")
	page.MustEval(`() => PerformStd('Pcl')`)

	fmt.Println("⏳ Waiting for semester select to appear...")
	page.MustElement("#edSemester")

	return page
}

func getTargetRows(page *rod.Page) []*rod.Element {
	table := page.MustElement(`table`).MustElement("tbody")
	trs := table.MustElements(":scope > tr")
	if len(trs) <= 3 {
		fmt.Println("⚠️ Table has fewer than 4 <tr> elements.")
		return nil
	}
	return trs[3].MustElements(":scope > td > table > tbody > tr")
}

func processRow(page *rod.Page, index, id int) bool {
	rows := getTargetRows(page)
	if index >= len(rows) {
		fmt.Printf("❌ Row %d not found (only %d rows)\n", index, len(rows))
		return false
	}

	row := rows[index]
	row.MustScrollIntoView()
	row.MustClick()
	page.MustWaitLoad()

	fmt.Printf("✅ [Row %d] Clicked row successfully\n", index)

	data := ClassData{
		ID:            id,
		Semester:      page.MustElement("#edSemester").MustText(),
		Department:    page.MustElement("#edDepartment").MustText(),
		CourseName:    page.MustElement("#edName").MustText(),
		CourseNumber:  page.MustElement("#edSrl").MustText(),
		Group:         page.MustElement("#edGroup").MustText(),
		Units:         page.MustElement("#edTotalUnit").MustText(),
		ClassType:     page.MustElement("#edClassType").MustText(),
		Instructor:    page.MustElement("#edTch").MustText(),
		TimeInWeek:    page.MustElement("#edTimeInWeek").MustText(),
		TimeRoom:      page.MustElement("#edTimeRoom").MustText(),
		FinalExamTime: page.MustElement("#edFinalTime").MustText(),
		FinalExamDate: page.MustElement("#edFinalDate").MustText(),
		Capacity:      page.MustElement("#edCapacity").MustText(),
		StudentCount:  page.MustElement("#edStdCount").MustText(),
	}

	var allData []ClassData
	fileName := "data.json"
	if _, err := os.Stat(fileName); err == nil {
		file, err := os.ReadFile(fileName)
		if err == nil {
			_ = json.Unmarshal(file, &allData)
		}
	}

	allData = append(allData, data)

	file, err := os.Create(fileName)
	if err != nil {
		log.Fatalf("Failed to create data.json: %v", err)
	}
	defer file.Close()

	encoder := json.NewEncoder(file)
	encoder.SetIndent("", "  ")
	if err := encoder.Encode(allData); err != nil {
		log.Fatalf("Failed to write JSON: %v", err)
	}

	page.MustEval(`() => window.history.back()`)
	page.MustWaitLoad()
	return true
}
