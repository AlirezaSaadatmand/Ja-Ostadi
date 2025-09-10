"use client"

import { forwardRef, useRef } from "react"
import type { CourseResponse } from "../../types"
import type { TableCell } from "../../store/schedule/useScheduleTableStore"

interface WeeklyTableProps {
  days: string[]
  timeSlots: { label: string; key: string; start: string; end: string }[]
  table: Record<string, TableCell>
  scheduledCourses: CourseResponse[]
  onRemoveCourse: (courseId: number) => void
  onExportPdf: (data: {
    scheduledCourses: CourseResponse[]
    table: Record<string, TableCell>
    days: string[]
    timeSlots: { label: string; key: string; start: string; end: string }[]
  }) => Promise<void>
  isExporting: boolean
}

const WeeklyTable = forwardRef<HTMLDivElement, WeeklyTableProps>(
  ({ days, timeSlots, table, onRemoveCourse, onExportPdf, isExporting, scheduledCourses }, ref) => {
    const wrapperRef = useRef<HTMLDivElement>(null)

    const getCourseForSlot = (day: string, timeSlotKey: string) => {
      const key = `${day}-${timeSlotKey}`
      return table[key]?.course || null
    }

    return (
      <div className="p-0 sm:p-3 lg:p-8 relative">
        <button
          onClick={() => onExportPdf({ scheduledCourses, table, days, timeSlots })}
          disabled={isExporting}
          data-pdf-exclude
          className="mb-2 sm:mb-4 bg-blue-600 hover:bg-blue-700 text-white px-2 sm:px-3 lg:px-5 py-1.5 sm:py-2 lg:py-3 rounded-lg text-xs sm:text-sm lg:text-base font-medium flex items-center gap-1 sm:gap-2 w-full justify-center
                 lg:absolute lg:top-6 lg:left-6 lg:w-auto lg:justify-start lg:mb-0"
        >
          {isExporting ? (
            <>
              <svg
                className="animate-spin h-3 w-3 lg:h-4 lg:w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              در حال تولید...
            </>
          ) : (
            <>
              <svg className="w-3 h-3 lg:w-4 lg:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H4a2 2 0 01-2-2V6a2 2 0 012-2h7.414l2.586 2.586A2 2 0 0016 6h4a2 2 0 012 2v10a2 2 0 01-2 2z"
                />
              </svg>
              ذخیره PDF
            </>
          )}
        </button>

        <div className="mb-2 sm:mb-3 lg:mb-6 text-center">
          <h3 className="text-base sm:text-lg lg:text-2xl font-semibold text-gray-900">برنامه هفتگی</h3>
          <p className="text-gray-600 mt-0.5 lg:mt-1 text-xs sm:text-sm lg:text-base">برنامه کلاس‌های هفتگی شما</p>
        </div>

        <div ref={wrapperRef} className="lg:overflow-x-auto flex justify-center" dir="rtl">
          <div
            ref={ref}
            style={{
              width: window.innerWidth < 1024 ? "100vw" : "100%",
            }}
          >
            <table className="border-collapse bg-white rounded-lg overflow-hidden shadow-sm w-full lg:min-w-[700px]">
              <thead>
                <tr className="bg-gray-50">
                  <th className="p-1 sm:p-2 lg:p-5 text-right font-semibold text-gray-700 border-b border-gray-200 w-16 sm:min-w-16 lg:w-40 text-xs sm:text-sm lg:text-base">
                    ساعت
                  </th>
                  {days.map((day) => (
                    <th
                      key={day}
                      className="p-1 sm:p-2 lg:p-5 text-center font-semibold text-gray-700 border-b border-gray-200 text-xs sm:text-sm lg:text-base lg:w-56"
                      style={{ width: window.innerWidth >= 1024 ? undefined : `${(100 - 16) / days.length}%` }}
                    >
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map((slot) => (
                  <tr key={slot.key} className="hover:bg-gray-50 transition-colors">
                    <td className="p-1 sm:p-1.5 lg:p-5 font-medium text-gray-600 bg-gray-50/50 border-b border-gray-200 text-xs sm:text-sm lg:text-base w-16 sm:min-w-16 lg:w-40">
                      {slot.label}
                    </td>
                    {days.map((day) => {
                      const course = getCourseForSlot(day, slot.key)
                      return (
                        <td
                          key={day + slot.key}
                          className="border-b border-gray-200 h-16 sm:h-10 lg:h-24 transition-colors relative border-l group lg:w-56"
                        >
                          {course ? (
                            <div className="absolute inset-0.5 lg:inset-1 bg-indigo-100 border border-indigo-300 rounded lg:rounded-xl p-0.5 sm:p-1 lg:p-2 flex flex-col justify-center">
                              <div className="text-[8px] lg:text-sm font-semibold text-indigo-900 truncate leading-tight">
                                {course.course.name}
                              </div>
                              <div className="text-[7px] lg:text-sm text-indigo-700 truncate leading-tight sm:block">
                                {course.instructor.name}
                              </div>
                              <button
                                onClick={() => onRemoveCourse(course.course.id)}
                                data-pdf-exclude
                                className="absolute top-0 lg:top-1 left-0 lg:left-1 w-3 h-3 lg:w-5 lg:h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-opacity duration-200 opacity-0 group-hover:opacity-100 text-xs leading-none"
                                title="حذف درس"
                              >
                                <svg
                                  className="w-2 h-2 lg:w-3 lg:h-3"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
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
        </div>
      </div>
    )
  },
)

WeeklyTable.displayName = "WeeklyTable"
export default WeeklyTable
