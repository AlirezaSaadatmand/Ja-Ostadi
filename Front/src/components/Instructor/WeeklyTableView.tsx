"use client"

import React, { useMemo } from "react"
import type { CourseInSemester } from "../../types"
import { useInstructorDetailStore } from "../../store/instructors/useInstructorDetailStore"

const DEFAULT_TIME_SLOTS = [
  { label: "08:00 - 10:00", key: "08:00-10:00", start: "08:00", end: "10:00" },
  { label: "10:00 - 12:00", key: "10:00-12:00", start: "10:00", end: "12:00" },
  { label: "12:00 - 13:30", key: "12:00-13:30", start: "12:00", end: "13:30" },
  { label: "13:30 - 15:30", key: "13:30-15:30", start: "13:30", end: "15:30" },
  { label: "15:30 - 17:30", key: "15:30-17:30", start: "15:30", end: "17:30" },
  { label: "17:30 - 19:30", key: "17:30-19:30", start: "17:30", end: "19:30" },
]

const DEFAULT_DAYS = ["شنبه", "يک شنبه", "دو شنبه", "سه شنبه", "چهار شنبه"]

const WeeklyTableView: React.FC = () => {
  const { instructorCoursesBySemester } = useInstructorDetailStore()

  const tableData = useMemo(() => {
    const semester = instructorCoursesBySemester.find(
      (s) => s.semester.name === "اول - 1404"
    )

    const map: Record<string, CourseInSemester> = {}
    if (!semester || !semester.courses) return map

    semester.courses.forEach((course) => {
      if (!course.time) return
      course.time.forEach((t) => {
        const key = `${t.day}-${t.start_time}-${t.end_time}`
        map[key] = course
      })
    })
    return map
  }, [instructorCoursesBySemester])

  const currentSemester =
    instructorCoursesBySemester.find(
      (s) => s.semester.name === "اول - 1404"
    )?.semester.name || "برنامه هفتگی"

  return (
    <div className="p-2 sm:p-4 lg:p-8 w-full" dir="rtl">
      <div className="mb-4 text-center">
        <h3 className="text-base sm:text-lg lg:text-2xl font-semibold text-gray-900">
          {currentSemester}
        </h3>
        <p className="text-gray-600 mt-1 text-xs sm:text-sm lg:text-base">
          مشاهده برنامه کلاس‌ها
        </p>
      </div>

      <div className="overflow-x-auto w-full text-center">
        <table className="w-full table-fixed border-collapse bg-white rounded-lg overflow-hidden shadow-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-2 text-right font-semibold text-gray-700 border-b border-gray-200 text-xs sm:text-sm">
                روز / ساعت
              </th>
              {DEFAULT_TIME_SLOTS.map((slot) => (
                <th
                  key={slot.key}
                  className="p-1 sm:p-2 text-center font-semibold text-gray-700 border-b border-gray-200 text-[10px] sm:text-sm"
                >
                  {slot.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {DEFAULT_DAYS.map((day) => (
              <tr key={day} className="hover:bg-gray-50 transition-colors">
                <td className="p-1 sm:p-2 font-medium text-gray-600 bg-gray-50/50 border-b border-gray-200 text-[10px] sm:text-sm">
                  {day}
                </td>

                {DEFAULT_TIME_SLOTS.map((slot) => {
                  const course = tableData[`${day}-${slot.start}-${slot.end}`]
                  return (
                    <td
                      key={`${day}-${slot.key}`}
                      className="h-16 sm:h-20 border-b border-gray-200 border-l relative"
                    >
                      {course ? (
                        <div className="absolute inset-0.5 bg-indigo-100 border border-indigo-300 rounded-md p-0.5 sm:p-1 flex flex-col justify-center">
                          <div className="text-[9px] sm:text-xs font-semibold text-indigo-900 truncate sm:pb1 lg:pb-2 text-center">
                            {course.name}
                          </div>
                          <div className="text-[8px] sm:text-xs text-indigo-700 truncate text-center">
                            {
                              course.time.find(
                                (t) =>
                                  t.day === day && t.start_time === slot.start
                              )?.room || ""
                            }
                          </div>
                        </div>
                      ) : null}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default WeeklyTableView
