package main

import (
	"fmt"
	"log"
	"os"
	"sync"
	"time"

	"github.com/go-rod/rod"
	"github.com/go-rod/rod/lib/launcher"
	"github.com/joho/godotenv"
)

func main() {
	fmt.Println("🔄 Loading environment variables...")
	_ = godotenv.Load()

	fmt.Println("🚀 Launching browser with throttling disabled...")
	url := launcher.New().
		Headless(true).
		Leakless(true).
		Set("disable-background-timer-throttling").
		Set("disable-renderer-backgrounding").
		Set("disable-backgrounding-occluded-windows").
		MustLaunch()

	browser := rod.New().ControlURL(url).MustConnect()
	defer browser.MustClose()

	fmt.Println("🔐 Logging in and navigating to the target page...")
	page := loginAndNavigate(browser)
	pageURL := page.MustInfo().URL
	fmt.Println("✅ Logged in and navigated.")

	fmt.Println("📋 Selecting semester and department...")
	loadSemesterAndDepartment(page)
	page.MustElement("#edDisplay").MustClick()
	page.MustWaitLoad() // <-- ADD THIS!
	page.MustElement("table tbody tr")
	fmt.Println("✅ Semester and department loaded.")

	rows := getTargetRows(page)
	if len(rows) == 0 {
		fmt.Println("❌ No rows found.")
		return
	}
	fmt.Printf("✅ Found %d rows to process.\n", len(rows)-3)

	var wg sync.WaitGroup
	for i := 3; i < len(rows); i++ {
		wg.Add(1)
		go func(index int) {
			defer wg.Done()
			fmt.Printf("🧵 [Row %d] Starting goroutine...\n", index)

			newPage := browser.MustIncognito().MustPage("")
			defer newPage.MustClose()

			processRow(newPage, pageURL, index)
		}(i)
	}

	wg.Wait()
	fmt.Println("🏁 All rows processed.")
}

func loginAndNavigate(browser *rod.Browser) *rod.Page {
	fmt.Println("🌐 Opening login page...")
	page := browser.MustPage("https://pershiess.fasau.ac.ir/Sess/14504217983")
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

func loadSemesterAndDepartment(page *rod.Page) {
	fmt.Println("🎓 Selecting semester and department filters...")
	page.MustElement("select#edSemester").MustSelect("دوم - 1403")
	page.MustElement("select#edDepartment").MustSelect("بخش مهندسي کامپيوتر")
}

func getTargetRows(page *rod.Page) []*rod.Element {
	fmt.Println("🔍 Locating rows in the table...")
	table := page.MustElement(`table`).MustElement("tbody")
	trs := table.MustElements(":scope > tr")
	if len(trs) <= 3 {
		fmt.Println("⚠️ Table has fewer than 4 <tr> elements.")
		return nil
	}
	return trs[3].MustElements(":scope > td > table > tbody > tr")
}

func processRow(page *rod.Page, url string, index int) {
	fmt.Printf("🔄 [Row %d] Navigating to target page...\n", index)
	page.MustNavigate(url)
	page.MustWaitLoad()

	fmt.Printf("🎯 [Row %d] Setting filters...\n", index)

	err := os.WriteFile("output.html", []byte(page.MustHTML()), 0644)
	if err != nil {
		log.Fatalf("❌ Failed to save HTML file: %v", err)
	}
	loadSemesterAndDepartment(page)

	fmt.Printf("📤 [Row %d] Clicking display...\n", index)
	page.MustElement("#edDisplay").MustClick()
	page.MustWaitLoad() // or WaitElements if AJAX

	fmt.Printf("🔍 [Row %d] Getting rows...\n", index)
	rows := getTargetRows(page)
	if index >= len(rows) {
		fmt.Printf("❌ [Row %d] Row not found (only %d rows)\n", index, len(rows))
		return
	}

	fmt.Printf("🖱️ [Row %d] Clicking row...\n", index)
	row := rows[index]
	row.MustScrollIntoView()
	row.MustClick()

	fmt.Printf("✅ [Row %d] Clicked row successfully\n", index)

	html, _ := page.HTML()
	fmt.Printf("📝 [Row %d] HTML content:\n", index)
	fmt.Println(html)
}
