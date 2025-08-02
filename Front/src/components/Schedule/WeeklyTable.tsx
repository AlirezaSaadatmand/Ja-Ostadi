"use client"

import { forwardRef } from "react"
import type { CourseResponse } from "../../types"
import type { TableCell } from "../../store/useScheduleTableStore"
import jsPDF from "jspdf" // Import jsPDF
import html2canvas from "html2canvas" // Import html2canvas
import toast from "react-hot-toast" // Import toast

interface WeeklyTableProps {
  days: string[]
  timeSlots: { label: string; key: string; start: string; end: string }[]
  table: Record<string, TableCell>
  scheduledCourses: CourseResponse[]
  onRemoveCourse: (courseId: number) => void
}

const WeeklyTable = forwardRef<HTMLDivElement, WeeklyTableProps>(({ days, timeSlots, table, onRemoveCourse }, ref) => {
  const getCourseForSlot = (day: string, timeSlotKey: string) => {
    const key = `${day}-${timeSlotKey}`
    return table[key]?.course || null
  }

  // Handle PDF export
const handleExportPdf = async () => {
  try {
    if (!ref || typeof ref === "function" || !ref.current) {
      toast.error("خطا: عنصر جدول یافت نشد.")
      return
    }

    const element = ref.current
    const canvas = await html2canvas(element, {
      scale: 2,       // 2 is enough; 4 creates huge blurry image
      useCORS: true,
      logging: false,
      scrollX: 0,
      scrollY: -window.scrollY,
      // foreignObjectRendering: true
    })

    const imgData = canvas.toDataURL("image/png")
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "pt",
      format: "a4",
    })

    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()

    // Scale to fit page
    const ratio = Math.min(pageWidth / canvas.width, pageHeight / canvas.height)
    const imgWidth = canvas.width * ratio
    const imgHeight = canvas.height * ratio

    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight)
    pdf.save("برنامه_هفتگی.pdf")
    toast.success("برنامه هفتگی با موفقیت به PDF تبدیل شد.")
  } catch (error) {
    console.error("Error generating PDF:", error)
    toast.error("خطا در تولید فایل PDF")
  }
}


  return (
    <div className="p-6 relative">
      {" "}
      {/* Added relative for absolute positioning of button */}
      {/* PDF Export Button - now responsive and positioned */}
      <button
        onClick={handleExportPdf}
        className="mb-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 w-full justify-center
                   md:absolute md:top-6 md:right-6 md:w-auto md:justify-start md:mb-0" // Positioned top-right for md+ screens
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H4a2 2 0 01-2-2V6a2 2 0 012-2h7.414l2.586 2.586A2 2 0 0016 6h4a2 2 0 012 2v10a2 2 0 01-2 2z"
          />
        </svg>
        ذخیره PDF
      </button>
      <div className="mb-6 text-center">
        <h3 className="text-xl font-semibold text-gray-900">برنامه هفتگی</h3>
        <p className="text-gray-600 mt-1">برنامه کلاس‌های هفتگی شما</p>
      </div>
      {/* Table for all screen sizes - apply ref here */}
      <div ref={ref} className="overflow-x-auto">
        <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow-sm min-w-[600px]">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-4 text-right font-semibold text-gray-700 border-b border-gray-200 w-32">ساعت</th>
              {days.map((day) => (
                <th key={day} className="p-4 text-center font-semibold text-gray-700 border-b border-gray-200 w-40">
                  {/* Changed min-w-24 to w-40 */}
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map((slot) => (
              <tr key={slot.key} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 font-medium text-gray-600 bg-gray-50/50 border-b border-gray-200 text-sm">
                  {slot.label}
                </td>
                {days.map((day) => {
                  const course = getCourseForSlot(day, slot.key)
                  return (
                    <td
                      key={day + slot.key}
                      className="border-b border-gray-200 h-20 transition-colors relative border-l group w-40" // Added w-40
                      data-day={day}
                      data-slot={slot.key}
                    >
                      {course ? (
                        <div className="absolute inset-1 bg-indigo-100 border border-indigo-300 rounded p-2 flex flex-col justify-center">
                          <div className="text-xs font-medium text-indigo-900 truncate">{course.course.name}</div>
                          <div className="text-xs text-indigo-700 truncate">{course.instructor.name}</div>
                          <button
                            onClick={() => onRemoveCourse(course.course.id)}
                            className="absolute top-1 left-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-opacity duration-200 opacity-0 group-hover:opacity-100"
                            title="حذف درس"
                          >
                            <svg className="w-2 h-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      ) : (
                        <div className="absolute inset-0"></div>
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobile scroll hint */}
      <div className="mt-4 text-center text-sm text-gray-500 md:hidden">برای مشاهده کامل جدول، به چپ و راست بکشید</div>
    </div>
  )
})

WeeklyTable.displayName = "WeeklyTable"

export default WeeklyTable
