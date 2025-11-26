"use client"

import React from "react"
import type { RoomScheduleCourse } from "../../types"
import { DAYS, TIME_SLOTS } from "../../store/usefull/useRoomScheduleStore"


interface Props {
  roomSchedule: RoomScheduleCourse[]
}

const toMinutes = (time: string) => {
  const [h, m] = time.split(":").map(Number)
  return h * 60 + m
}

const RoomWeeklyTableView: React.FC<Props> = ({ roomSchedule }) => {
  return (
    <div className="p-2 sm:p-4 lg:p-8 w-full" dir="rtl">
      <div className="overflow-x-auto w-full text-center">
        <table className="w-full table-fixed border-collapse bg-white rounded-lg shadow-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-2 text-right font-semibold text-gray-700 border-b border-gray-200 text-xs sm:text-sm">
                روز / ساعت
              </th>
              {TIME_SLOTS.map((slot) => (
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
            {DAYS.map((day) => (
              <tr key={day} className="hover:bg-gray-50 transition-colors">
                <td className="h-18 sm:h-22 p-1 sm:p-2 font-medium text-gray-600 bg-gray-50/50 border-b border-gray-200 text-[10px] sm:text-sm">
                  {day}
                </td>

                {TIME_SLOTS.map((slot) => {
                  const course = roomSchedule.find((c) =>
                    c.time.some((t) => {
                      if (t.day !== day) return false
                      const courseStart = toMinutes(t.start_time)
                      const courseEnd = toMinutes(t.end_time)
                      const slotStart = toMinutes(slot.start)
                      const slotEnd = toMinutes(slot.end)
                      return courseStart < slotEnd && courseEnd > slotStart
                    })
                  )

                  return (
                    <td
                      key={`${day}-${slot.key}`}
                      className="h-20 sm:h-24 border-b border-gray-200 border-l relative"
                    >
                      {course && (
                        <div className="absolute inset-0.5 bg-indigo-100 border border-indigo-300 rounded-md p-0.5 sm:p-1 flex flex-col justify-center">
                          <div className="text-[9px] sm:text-xs font-semibold text-indigo-900 truncate text-center">
                            {course.courseName}
                          </div>
                          <div className="text-[8px] sm:text-xs text-indigo-700 truncate text-center lg:pt-1">
                            {course.instructor}
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
    </div>
  )
}

export default RoomWeeklyTableView
