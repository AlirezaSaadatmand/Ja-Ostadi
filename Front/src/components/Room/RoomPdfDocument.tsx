import type { FC } from "react"
import type { RoomScheduleCourse } from "../../types"
import { DAYS, TIME_SLOTS } from "../../store/usefull/useRoomScheduleStore"

interface Props {
  schedule: RoomScheduleCourse[]
}

const RoomPdfDocument: FC<Props> = ({ schedule }) => {

  const findClass = (day: string, slotKey: string) => {
    const slot = TIME_SLOTS.find(s => s.key === slotKey)
    if (!slot) return null

    return schedule.find(course =>
      course.time.some(
        t => t.day === day && t.start_time === slot.start && t.end_time === slot.end
      )
    )
  }

  return (
    <div className="p-10 bg-white text-gray-900" dir="rtl" style={{ width: "95%", minHeight: "100vh", fontSize: "20px" }}>
      
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
          برنامه هفتگی اتاق
        </h1>
        <p className="text-gray-700 text-xl">
          برنامه کلاس‌های ثبت شده در اتاق
        </p>
      </div>

      <div className="flex-[3]">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">برنامه زمانی</h2>

        <table className="border-collapse bg-white rounded-xl overflow-hidden shadow-lg" style={{ width: "100%", tableLayout: "fixed" }}>
          <thead>
            <tr className="bg-gray-100">
              <th className="p-4 text-right font-bold border-b text-gray-800 text-lg" style={{ width: "15%" }}>
                روز / ساعت
              </th>
              {TIME_SLOTS.map(slot => (
                <th key={slot.key} className="p-4 text-center font-bold border-b text-gray-800 text-lg">
                  {slot.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {DAYS.map(day => (
              <tr key={day} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 font-semibold text-gray-700 bg-gray-50 border-b text-md text-center" style={{ height: "140px" }}>
                  {day}
                </td>

                {TIME_SLOTS.map(slot => {
                  const course = findClass(day, slot.key)

                  return (
                    <td key={day + slot.key} className="border-b border-gray-200 border-l text-center align-middle" style={{ height: "120px" }}>
                      {course ? (
                        <div className="bg-indigo-100 p-4 rounded-2xl border border-indigo-300 h-full flex flex-col justify-between">
                          <div>
                            <p className="text-xl font-bold text-indigo-900">{course.courseName}</p>
                            <p className="text-md text-indigo-700 mt-1">{course.instructor}</p>
                          </div>
                        </div>
                      ) : <div></div>}
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

export default RoomPdfDocument
