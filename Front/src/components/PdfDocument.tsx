import type React from "react"
import type { CourseResponse } from "../types"
import type { TableCell } from "../store/schedule/useScheduleTableStore"
import { days, timeSlots } from "../store/schedule/useScheduleTableStore"

interface PdfDocumentProps {
  scheduledCourses: CourseResponse[]
  table: Record<string, TableCell>
}

const PdfDocument: React.FC<PdfDocumentProps> = ({ scheduledCourses, table }) => {
  const findMatchingSlotKey = (start: string, end: string) => {
    const normalizedStart = start.padStart(5, "0")
    const normalizedEnd = end.padStart(5, "0")
    return timeSlots.find(
      (slot) => slot.start === normalizedStart && slot.end === normalizedEnd
    )?.key
  }

  const getCourseForSlot = (day: string, timeSlotKey: string) => {
    const key = `${day}-${timeSlotKey}`
    const cell = table[key]
    if (!cell || !cell.course) return null

    const time = cell.course.time.find(
      (t) => t.day === day && findMatchingSlotKey(t.start_time, t.end_time) === timeSlotKey
    )

    return { course: cell.course, room: time?.room || "" }
  }

  const totalUnits = scheduledCourses.reduce(
    (sum, course) => sum + parseFloat(course.course.units),
    0
  )

  return (
    <div
      className="p-10 bg-white text-gray-900"
      dir="rtl"
      style={{ width: "90%", minHeight: "100vh", fontSize: "20px" }}
    >
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
          برنامه هفتگی دانشجو
        </h1>
        <p className="text-gray-700 text-xl">
          برنامه کلاس‌های هفتگی و دروس انتخاب شده
        </p>
      </div>

      <div className="flex gap-8">
        {/* Weekly Table */}
        <div className="flex-[3]">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            برنامه هفتگی
          </h2>
          <table
            className="border-collapse bg-white rounded-xl overflow-hidden shadow-lg"
            style={{ width: "100%", tableLayout: "fixed" }}
          >
            <thead>
              <tr className="bg-gray-100">
                <th
                  className="p-4 text-right font-bold text-gray-800 border-b border-gray-300 text-lg"
                  style={{ width: "15%" }}
                >
                  روز / ساعت
                </th>
                {timeSlots.map((slot) => (
                  <th
                    key={slot.key}
                    className="p-4 text-center font-bold text-gray-800 border-b border-gray-300 text-lg"
                    style={{ width: `${85 / timeSlots.length}%` }}
                  >
                    {slot.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {days.map((day) => (
                <tr key={day} className="hover:bg-gray-50 transition-colors">
                  <td
                    className="p-4 font-semibold text-gray-700 bg-gray-50 border-b border-gray-200 text-md text-center"
                    style={{ height: "140px" }}
                  >
                    {day}
                  </td>

                  {timeSlots.map((slot) => {
                    const slotData = getCourseForSlot(day, slot.key)
                    return (
                      <td
                        key={day + slot.key}
                        className="border-b border-gray-200 transition-colors relative border-l text-center align-middle"
                        style={{ height: "100px" }}
                      >
                        {slotData ? (
                          <div className="w-full h-full bg-indigo-100 border border-indigo-300 rounded-2xl p-4 flex flex-col justify-between">
                            <div>
                              <div className="text-lg font-bold text-indigo-900 leading-tight break-words">
                                {slotData.course.course.name}
                              </div>
                              <div className="text-md text-indigo-700 mt-2 leading-tight break-words">
                                {slotData.course.instructor.name || "—"}
                              </div>
                            </div>

                            {slotData.room && (
                              <div className="mt-3 text-sm bg-yellow-200 text-yellow-900 rounded-xl px-2 py-1 text-center font-semibold">
                                {slotData.room}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="w-full h-full"></div>
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Scheduled Courses */}
        <div className="flex-[1] flex flex-col">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            دروس برنامه ریزی شده
          </h2>
          <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center text-md font-semibold text-gray-700 rounded-t-lg">
            <span>تعداد کل واحدها:</span>
            <span className="text-purple-700 text-2xl font-bold">{totalUnits}</span>
          </div>
          {scheduledCourses.length === 0 ? (
            <div className="p-6 text-center border border-gray-200 rounded-b-lg text-gray-500 text-lg">
              هیچ درسی در برنامه شما نیست
            </div>
          ) : (
            <div className="flex-1 flex flex-col gap-3 p-4 border border-gray-200 rounded-b-lg overflow-hidden">
              {scheduledCourses.map((course) => (
                <div
                  key={course.course.id}
                  className="p-4 rounded-lg bg-gray-50 border border-gray-200 shadow-sm flex justify-between items-center mb-4"
                >
                  <div className="flex flex-col w-full">
                    <span className="font-bold text-gray-900 text-lg">{course.course.name}</span>
                    <span className="text-sm text-gray-600">
                      استاد: {course.instructor.name || "—"}
                    </span>
                  </div>

                  <div className="flex flex-col w-1/3">
                    <span className="text-sm bg-purple-100 text-purple-800 px-1 py-1 rounded text-center">
                      {course.course.units} واحد
                    </span>
                    {course.course.number && (
                      <span className="text-sm bg-blue-100 text-blue-800 px-1 py-1 rounded text-center">
                        شماره درس: {course.course.number}
                      </span>
                    )}
                    {course.course.group && (
                      <span className="text-sm bg-green-100 text-green-800 px-1 py-1 rounded text-center">
                        گروه: {course.course.group}
                      </span>
                    )}
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
