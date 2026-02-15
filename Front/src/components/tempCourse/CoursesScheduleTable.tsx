import React, { useMemo } from "react"
import { X } from "lucide-react"
import type { TempCourse } from "../../types"

interface Props {
  courses: TempCourse[]
  onReset: () => void
  onRemoveCourse: (id: number | undefined) => void
}

const TIME_SLOTS = [
  { label: "08:00 - 10:00", key: "08:00-10:00" },
  { label: "10:00 - 12:00", key: "10:00-12:00" },
  { label: "12:00 - 13:30", key: "12:00-13:30" },
  { label: "13:30 - 15:30", key: "13:30-15:30" },
  { label: "15:30 - 17:30", key: "15:30-17:30" },
  { label: "17:30 - 19:30", key: "17:30-19:30" },
]

const DAYS = ["شنبه", "يک شنبه", "دو شنبه", "سه شنبه", "چهار شنبه"]

const CoursesScheduleTable: React.FC<Props> = ({
  courses,
  onReset,
  onRemoveCourse,
}) => {
  const schedule = useMemo(() => {
    const map: Record<string, TempCourse[]> = {}

    for (const day of DAYS) {
      for (const slot of TIME_SLOTS) {
        map[`${day}-${slot.key}`] = []
      }
    }

    const addToMap = (
      day: string,
      time: string,
      course: TempCourse
    ) => {
      if (!day || !time) return
      const normalizedTime = time.replace(/\s/g, "")
      const key = `${day}-${normalizedTime}`
      if (map[key]) {
        map[key].push(course)
      }
    }

    courses.forEach((course) => {
      addToMap(course.firstDay, course.firstTime, course)
      addToMap(course.secondDay, course.secondTime, course)
    })

    return map
  }, [courses])

  return (
    <div className="bg-white rounded-2xl shadow overflow-x-auto">
      <div className="flex justify-between items-center p-6 border-b bg-gray-50">
        <h3 className="font-bold text-lg">
          جدول برنامه هفتگی
        </h3>

        <button
          onClick={onReset}
          className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm hover:bg-red-100"
        >
          ریست جدول
        </button>
      </div>

      <table className="w-full text-sm text-center border-collapse">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-4 border text-base">زمان</th>
            {DAYS.map((day) => (
              <th key={day} className="p-2 border text-base">
                {day}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {TIME_SLOTS.map((slot) => (
            <tr key={slot.key}>
              <td className="p-4 border font-semibold bg-gray-50 text-base">
                {slot.label}
              </td>

              {DAYS.map((day) => {
                const cellCourses =
                  schedule[`${day}-${slot.key}`]

                return (
                  <td
                    key={`${day}-${slot.key}`}
                    className="border align-top min-w-[120px] h-[100px] p-1"
                  >
                    <div className="flex flex-col gap-1">
                      {cellCourses?.map((course) => (
                        <div
                          key={course.id}
                          className="relative bg-[#AB8A58]/10 text-sm pt-2 pb-2 rounded-xl border border-[#AB8A58]/20"
                        >
                          <button
                            onClick={() =>
                              onRemoveCourse(course.id)
                            }
                            className="absolute top-1 left-1 bg-white rounded-full p-1 shadow hover:bg-red-50"
                          >
                            <X size={14} className="text-red-500" />
                          </button>

                          <div className="font-semibold text-sm">
                            {course.courseName}
                          </div>

                          <div>
                            گروه {course.group}
                          </div>

                          <div className="text-gray-600 text-xs mt-1">
                            {course.instructor}
                          </div>
                        </div>
                      ))}
                    </div>
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default CoursesScheduleTable
