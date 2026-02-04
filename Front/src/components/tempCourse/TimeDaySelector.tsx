import React, { useEffect, useState } from "react"
import { useTempCourseStore } from "../../store/tempCourse/useTempCourseStore"

const TIME_SLOTS = [
  { label: "08:00 - 10:00", key: "08:00-10:00", start: "08:00", end: "10:00" },
  { label: "10:00 - 12:00", key: "10:00-12:00", start: "10:00", end: "12:00" },
  { label: "12:00 - 13:30", key: "12:00-13:30", start: "12:00", end: "13:30" },
  { label: "13:30 - 15:30", key: "13:30-15:30", start: "13:30", end: "15:30" },
  { label: "15:30 - 17:30", key: "15:30-17:30", start: "15:30", end: "17:30" },
  { label: "17:30 - 19:30", key: "17:30-19:30", start: "17:30", end: "19:30" },
]

const DAYS = ["شنبه", "يک شنبه", "دو شنبه", "سه شنبه", "چهار شنبه"]

interface Props {
  value: {
    day: string
    time: string
  } | null
  onSelect: (day: string, time: string) => void
  title: string
}

const TimeDaySelector: React.FC<Props> = ({ value, onSelect, title }) => {
  const { tempCourses, fetchTempCourses } = useTempCourseStore()
  const [expandedCell, setExpandedCell] = useState<{ day: string; time: string } | null>(null)

  useEffect(() => {
    fetchTempCourses()
  }, [fetchTempCourses])

  const getCoursesAtTime = (day: string, time: string) => {
    return tempCourses.filter(course => 
      (course.firstDay === day && course.firstTime === time) ||
      (course.secondDay === day && course.secondTime === time)
    )
  }

  const handleCellClick = (day: string, time: string) => {
    const conflicts = getCoursesAtTime(day, time)
    
    if (expandedCell?.day === day && expandedCell?.time === time) {
      setExpandedCell(null)
    } else if (conflicts.length > 0) {
      setExpandedCell({ day, time })
    } else {
      setExpandedCell(null)
    }
    
    onSelect(day, time)
  }

  const isCellExpanded = (day: string, time: string) => {
    return expandedCell?.day === day && expandedCell?.time === time
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-4 mt-6">
      <h3 className="font-bold text-gray-800 mb-4">{title}</h3>

      <div className="overflow-x-auto">
        <table className="w-full table-fixed border-collapse text-center">
          <thead>
            <tr>
              <th className="p-2 text-sm text-gray-600">روز / ساعت</th>
              {TIME_SLOTS.map((t) => (
                <th key={t.start} className="p-2 text-xs text-gray-600">
                  {t.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {DAYS.map((day) => (
              <tr key={day}>
                <td className="p-2 text-sm font-medium text-gray-700 sticky left-0 bg-white z-10">
                  {day}
                </td>

                {TIME_SLOTS.map((slot) => {
                  const courses = getCoursesAtTime(day, slot.label)
                  const hasCourses = courses.length > 0
                  const selected = value?.day === day && value?.time === slot.label
                  const isExpanded = isCellExpanded(day, slot.label)

                  return (
                    <td
                      key={slot.start}
                      onClick={() => handleCellClick(day, slot.label)}
                      className={`h-14 cursor-pointer border transition relative group min-w-[120px] ${
                        selected ? "bg-indigo-200 border-indigo-400" : ""
                      } ${
                        hasCourses ? "bg-yellow-50 hover:bg-yellow-100" : "hover:bg-gray-100"
                      } ${
                        isExpanded ? "bg-yellow-100" : ""
                      }`}
                      style={{ height: isExpanded ? 'auto' : '3.5rem' }}
                    >
                      {!isExpanded && (
                        <>
                          {hasCourses && (
                            <div className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs font-bold">
                                {courses.length}
                              </span>
                            </div>
                          )}
                          
                          {hasCourses && (
                            <div className="absolute z-10 left-1/2 -translate-x-1/2 bottom-full mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                              {courses.length} درس موجود - برای مشاهده کلیک کنید
                              <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-800"></div>
                            </div>
                          )}
                        </>
                      )}

                      {isExpanded && (
                        <div className="p-2 text-right space-y-1 overflow-hidden">
                          <div className="flex justify-between items-center mb-2 pb-1 border-b">
                            <span className="text-xs text-gray-500">
                              {courses.length} درس
                            </span>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation()
                                setExpandedCell(null)
                              }}
                              className="text-gray-400 hover:text-gray-600 text-xs"
                            >
                              ✕ بستن
                            </button>
                          </div>
                          
                          <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                            {courses.map((course, index) => (
                              <div 
                                key={index} 
                                className="text-xs bg-white p-2 rounded border border-gray-200 shadow-sm"
                              >
                                <div className="font-semibold text-gray-800 truncate">
                                  {course.courseName}
                                </div>
                                <div className="text-gray-600 truncate">
                                  {course.instructor}
                                </div>
                                <div className="flex justify-between text-gray-500 mt-1">
                                  <span className="text-xs">
                                    {course.firstDay === day ? course.firstRoom : course.secondRoom}
                                  </span>
                                  <span className="text-xs">
                                    {course.group}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {selected && !isExpanded && (
                        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-6 h-1 bg-indigo-500 rounded-full"></div>
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-sm text-gray-600 flex items-center gap-2">
        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
        <span>تعداد دروس موجود</span>
        
        <div className="w-3 h-3 bg-yellow-300 rounded-full ml-4"></div>
        <span>سلول دارای درس</span>
        
        <div className="w-3 h-3 bg-indigo-200 rounded-full ml-4"></div>
        <span>سلول انتخاب شده</span>
      </div>

      <div className="mt-2 text-xs text-gray-500">
        روی سلول‌های زرد رنگ کلیک کنید تا لیست دروس را مشاهده کنید
      </div>
    </div>
  )
}

export default TimeDaySelector