import React, { useMemo } from "react"
import type { TempCourse } from "../../types"

interface Props {
  courses: TempCourse[]
}

interface ConflictPair {
  courseA: TempCourse
  courseB: TempCourse
  day: string
  time: string
}

const ConflictingCoursesSection: React.FC<Props> = ({
  courses,
}) => {
  const conflicts = useMemo(() => {
    const result: ConflictPair[] = []

    for (let i = 0; i < courses.length; i++) {
      for (let j = i + 1; j < courses.length; j++) {
        const a = courses[i]
        const b = courses[j]

        const sessionsA = [
          { day: a.firstDay, time: a.firstTime },
          { day: a.secondDay, time: a.secondTime },
        ]

        const sessionsB = [
          { day: b.firstDay, time: b.firstTime },
          { day: b.secondDay, time: b.secondTime },
        ]

        for (const sa of sessionsA) {
          for (const sb of sessionsB) {
            if (
              sa.day &&
              sa.time &&
              sb.day &&
              sb.time &&
              sa.day === sb.day &&
              sa.time === sb.time
            ) {
              result.push({
                courseA: a,
                courseB: b,
                day: sa.day,
                time: sa.time,
              })
            }
          }
        }
      }
    }

    return result
  }, [courses])

  if (conflicts.length === 0) {
    return (
      <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl">
        هیچ تداخلی بین دروس وجود ندارد ✅
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow overflow-x-auto">
      <div className="p-4 border-b bg-red-50">
        <h3 className="text-lg font-bold text-red-700">
          دروس دارای تداخل زمانی
        </h3>
      </div>

      <table className="w-full text-sm text-center">
        <thead className="bg-gray-50 text-gray-700">
          <tr>
            <th className="p-3">#</th>
            <th className="p-3">روز</th>
            <th className="p-3">ساعت</th>
            <th className="p-3">درس اول</th>
            <th className="p-3">گروه</th>
            <th className="p-3">ترم هدف</th>
            <th className="p-3">درس دوم</th>
            <th className="p-3">گروه</th>
            <th className="p-3">ترم هدف</th>
          </tr>
        </thead>

        <tbody>
          {conflicts.map((conflict, index) => (
            <tr
              key={index}
              className="border-t hover:bg-red-50 transition"
            >
              <td className="p-3 font-medium">
                {index + 1}
              </td>

              <td className="p-3 text-red-600 font-semibold">
                {conflict.day}
              </td>

              <td className="p-3 text-red-600 font-semibold">
                {conflict.time}
              </td>

              <td className="p-3 font-medium border-r border-gray-300">
                {conflict.courseA.courseName}
              </td>

              <td className="p-3">
                {conflict.courseA.group}
              </td>

              <td className="p-3">
                {conflict.courseA.targetTerm}
              </td>

              <td className="p-3 font-medium border-r border-gray-300">
                {conflict.courseB.courseName}
              </td>

              <td className="p-3">
                {conflict.courseB.group}
              </td>
              <td className="p-3">
                {conflict.courseB.targetTerm}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ConflictingCoursesSection
