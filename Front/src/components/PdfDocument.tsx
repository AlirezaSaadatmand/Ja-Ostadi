import type React from "react"
import type { CourseResponse } from "../types"
import type { TableCell } from "../store/useScheduleTableStore"
import { days, timeSlots } from "../store/useScheduleTableStore"

interface PdfDocumentProps {
  scheduledCourses: CourseResponse[]
  table: Record<string, TableCell>
}

const PdfDocument: React.FC<PdfDocumentProps> = ({ scheduledCourses, table }) => {
  const getCourseForSlot = (day: string, timeSlotKey: string) => {
    const key = `${day}-${timeSlotKey}`
    return table[key]?.course || null
  }

  const totalUnits = scheduledCourses.reduce((sum, course) => sum + course.course.units, 0)

  return (
    <div className="p-8 bg-white text-gray-900" dir="rtl" style={{ width: "100%", minHeight: "100vh" }}>
      {/* Re-added max-w-screen-xl mx-auto for responsive centering */}
      <div className="max-w-screen-xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">برنامه هفتگی دانشجو</h1>
          <p className="text-gray-700">برنامه کلاس‌های هفتگی و دروس انتخاب شده</p>
        </div>

        <div className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4 text-center">برنامه هفتگی</h2>
          <div className="overflow-x-auto">
            <table
              className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow-sm"
              style={{ minWidth: "1000px" }}
            >
              <thead>
                <tr className="bg-gray-50">
                  <th className="p-5 text-right font-semibold text-gray-700 border-b border-gray-200 w-56">ساعت</th>
                  {days.map((day) => (
                    <th key={day} className="p-5 text-center font-semibold text-gray-700 border-b border-gray-200 w-56">
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map((slot) => (
                  <tr key={slot.key} className="hover:bg-gray-50 transition-colors">
                    <td className="p-5 font-medium text-gray-600 bg-gray-50/50 border-b border-gray-200 text-base">
                      {slot.label}
                    </td>
                    {days.map((day) => {
                      const course = getCourseForSlot(day, slot.key)
                      return (
                        <td
                          key={day + slot.key}
                          className="border-b border-gray-200 h-24 transition-colors relative border-l w-56"
                        >
                          {course ? (
                            <div className="absolute inset-1 bg-indigo-100 border border-indigo-300 rounded-xl p-2 flex flex-col justify-center">
                              <div className="text-sm font-semibold text-indigo-900 truncate">{course.course.name}</div>
                              <div className="text-sm text-indigo-700 truncate">{course.instructor.name}</div>
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
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4 text-center">دروس برنامه ریزی شده</h2>
          <div className="p-5 border-b border-gray-200 bg-gray-50 flex justify-between items-center text-sm font-medium text-gray-700 rounded-t-lg">
            <span>تعداد کل واحدها:</span>
            <span className="text-purple-700 text-xl font-bold">{totalUnits}</span>
          </div>
          {scheduledCourses.length === 0 ? (
            <div className="p-8 text-center border border-gray-200 rounded-b-lg">
              <p className="text-gray-500">هیچ درسی در برنامه شما نیست</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3 p-4 border border-gray-200 rounded-b-lg">
              {scheduledCourses.map((course) => (
                <div key={course.course.id} className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 text-right ml-2">
                      <span className="font-semibold text-gray-900 text-base block">{course.course.name}</span>
                      <span className="text-sm text-gray-500 block mt-1">استاد: {course.instructor.name}</span>
                    </div>
                    <span className="text-sm bg-purple-100 text-purple-700 px-2 py-1 rounded flex-shrink-0">
                      {course.course.units} واحد
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PdfDocument
