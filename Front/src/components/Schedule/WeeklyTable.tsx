"use client"

import type React from "react"
import type { CourseResponse } from "../../types"

interface WeeklyTableProps {
  days: string[]
  timeSlots: { label: string; key: string; start: string; end: string }[]
  scheduledCourses: CourseResponse[]
  onRemoveCourse: (courseId: number) => void
}

const WeeklyTable: React.FC<WeeklyTableProps> = ({ days, timeSlots, scheduledCourses, onRemoveCourse }) => {
  // Helper to normalize time strings to "HH:MM" format (e.g., "8:00" -> "08:00")
  const normalizeTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(":")
    return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`
  }

  // Function to check if a course should be displayed in a specific time slot and day
  const getCourseForSlot = (day: string, timeSlot: (typeof timeSlots)[0]) => {
    const normalizedSlotStart = normalizeTime(timeSlot.start)
    const normalizedSlotEnd = normalizeTime(timeSlot.end)

    console.log(`Checking slot: ${day} ${timeSlot.label}`)
    console.log(`Normalized slot times: ${normalizedSlotStart} - ${normalizedSlotEnd}`)

    return scheduledCourses.find((course) =>
      course.time.some((time) => {
        const normalizedCourseStart = normalizeTime(time.start_time)
        const normalizedCourseEnd = normalizeTime(time.end_time)

        console.log(`  Course time: ${time.day} ${time.start_time} - ${time.end_time}`)
        console.log(`  Normalized course time: ${normalizedCourseStart} - ${normalizedCourseEnd}`)
        console.log(
          `  Comparison: Day match=${time.day === day}, Start match=${normalizedCourseStart === normalizedSlotStart}, End match=${normalizedCourseEnd === normalizedSlotEnd}`,
        )

        const isMatch =
          time.day === day && normalizedCourseStart === normalizedSlotStart && normalizedCourseEnd === normalizedSlotEnd

        if (isMatch) {
          console.log(`  Match found for course: ${course.course.name}`)
        } else {
          console.log(`  No match for this course in this slot.`)
        }
        return isMatch
      }),
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6 text-center">
        <h3 className="text-xl font-semibold text-gray-900">برنامه هفتگی</h3>
        <p className="text-gray-600 mt-1">برنامه کلاس‌های هفتگی شما</p>
      </div>

      {/* Table for all screen sizes */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow-sm min-w-[600px]">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-4 text-right font-semibold text-gray-700 border-b border-gray-200 w-32">ساعت</th>
              {days.map((day) => (
                <th key={day} className="p-4 text-center font-semibold text-gray-700 border-b border-gray-200 min-w-24">
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
                  const course = getCourseForSlot(day, slot)
                  return (
                    <td
                      key={day + slot.key}
                      className="border-b border-gray-200 h-20 transition-colors cursor-pointer relative group border-l border-gray-100"
                      data-day={day}
                      data-slot={slot.key}
                    >
                      {course ? (
                        <div className="absolute inset-1 bg-indigo-100 border border-indigo-300 rounded p-2 flex flex-col justify-center">
                          <div className="text-xs font-medium text-indigo-900 truncate">{course.course.name}</div>
                          <div className="text-xs text-indigo-700 truncate">{course.instructor.name}</div>
                          <button
                            onClick={() => onRemoveCourse(course.course.id)}
                            className="absolute top-1 left-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
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
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="w-8 h-8 border-2 border-dashed border-blue-300 rounded-lg flex items-center justify-center">
                            <svg
                              className="w-4 h-4 text-blue-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                          </div>
                        </div>
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
}

export default WeeklyTable
