package scraper

import (
	"os"
	"time"

	"github.com/AlirezaSaadatmand/Ja-Ostadi/pkg/logging"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/scripts"
	"github.com/AlirezaSaadatmand/Ja-Ostadi/types"
	"github.com/go-rod/rod"
	"github.com/go-rod/rod/lib/launcher"
	"github.com/joho/godotenv"
)

type ScraperService struct {
	Logger logging.Logger
}

func NewScraperServices(logger logging.Logger) *ScraperService {
	return &ScraperService{
		Logger: logger,
	}
}

func (s *ScraperService) Scraper() {
	_ = godotenv.Load()

	url := launcher.New().
		Headless(true).
		Append("--no-sandbox").
		MustLaunch()

	browser := rod.New().ControlURL(url).MustConnect()
	defer browser.MustClose()

	page := s.loginAndNavigate(browser)

	semester := os.Getenv("EDSEMESTER")
	departments := page.MustElements("#edDepartment option")
	for deptIndex := range departments {
		departments := page.MustElements("#edDepartment option")

		deptVal := departments[deptIndex].MustProperty("value").String()
		deptText := departments[deptIndex].MustText()

		if deptVal == "" || deptVal == "0" {
			continue
		}

		s.Logger.Info(logging.Scraper, logging.Select, "Processing department", map[logging.ExtraKey]interface{}{
			"index":      deptIndex,
			"department": deptText,
			"value":      deptVal,
			"semester":   semester,
		})

		page.MustElement("#edSemester").MustSelect(semester)
		page.MustElement("#edDepartment").MustSelect(deptText)
		page.MustElement("#edDisplay").MustClick()
		page.MustWaitLoad()

		rows := getTargetRows(page)
		if len(rows) == 0 {
			continue
		}

		for rowIndex := 3; rowIndex < len(rows); rowIndex++ {

			ok := s.processRow(page, rowIndex)
			if !ok {
				for i := 0; i < 3; i++ {
					ok = s.processRow(page, rowIndex)
					if ok {
						break
					}
				}
			}
		}
	}

	s.Logger.Info(logging.Scraper, logging.Select, "All departments and courses processed", nil)
}

func (s *ScraperService) loginAndNavigate(browser *rod.Browser) *rod.Page {
	page := browser.MustPage(os.Getenv("URL"))
	page.MustWaitLoad()

	page.MustElement("#edId").MustInput(os.Getenv("USE"))
	page.MustElement("#edPass").MustInput(os.Getenv("PASSWORD"))
	page.MustElement("#edEnter").MustClick()
	page.MustWaitLoad()

	page.MustElement(`div[class="small-box bg-gray btn"]`).MustClick()
	time.Sleep(2 * time.Second)
	page.MustEval(`() => PerformStd('Pcl')`)
	page.MustElement("#edSemester")

	s.Logger.Info(logging.Scraper, logging.Login, "Login successful and navigated", nil)
	return page
}

func getTargetRows(page *rod.Page) []*rod.Element {
	table := page.MustElement(`table`).MustElement("tbody")
	trs := table.MustElements(":scope > tr")
	if len(trs) <= 3 {
		return nil
	}
	return trs[3].MustElements(":scope > td > table > tbody > tr")
}

func (s *ScraperService) processRow(page *rod.Page, index int) bool {
	rows := getTargetRows(page)
	if index >= len(rows) {
		s.Logger.Error(logging.Scraper, logging.Select, "Row not found", map[logging.ExtraKey]interface{}{
			"index": index,
			"rows":  len(rows),
		})
		return false
	}

	row := rows[index]
	row.MustScrollIntoView()
	row.MustClick()
	page.MustWaitLoad()

	data := types.CourseJSON{
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

	scripts.SaveData(data)

	s.Logger.Info(logging.Scraper, logging.Insert, "Course saved or updated successfully", map[logging.ExtraKey]interface{}{
		"course": data.CourseName,
		"id":     data.CourseNumber,
	})

	page.MustEval(`() => window.history.back()`)
	page.MustWaitLoad()
	return true
}
