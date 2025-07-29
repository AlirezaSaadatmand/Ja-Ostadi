"use client"

import type React from "react"
import type { CourseResponse } from "../../types"
import type { TableCell } from "../../store/useScheduleTableStore" // Import TableCell

interface WeeklyTableProps {
  days: string[]
  timeSlots: { label: string; key: string; start: string; end: string }[]
  table: Record<string, TableCell> // Now receives the table directly
  scheduledCourses: CourseResponse[] // Still needed for remove logic, but not for rendering cells
  onRemoveCourse: (courseId: number) => void
}

const WeeklyTable: React.FC<WeeklyTableProps> = ({ days, timeSlots, table, onRemoveCourse }) => {
  // Function to get the course for a specific time slot and day from the table state
  const getCourseForSlot = (day: string, timeSlotKey: string) => {
    const key = `${day}-${timeSlotKey}`
    return table[key]?.course || null
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
                  const course = getCourseForSlot(day, slot.key) // Get course directly from table
                  return (
                    <td
                      key={day + slot.key}
                      className="border-b border-gray-200 h-20 transition-colors relative border-l border-gray-100"
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
                        // Empty cell, no hover shape
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
}

export default WeeklyTable
