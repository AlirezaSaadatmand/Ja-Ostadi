import type { FC } from "react"
import type { RoomScheduleCourse } from "../../types"
import { DAYS, TIME_SLOTS } from "../../store/usefull/useRoomScheduleStore"
import { useRoomStore } from "../../store/usefull/useRoomScheduleStore"

interface Props {
  schedule: RoomScheduleCourse[]
}

const RoomPdfDocument: FC<Props> = ({ schedule }) => {
  const { selectedRoom } = useRoomStore()

  const findClass = (day: string, slotKey: string) => {
    const slot = TIME_SLOTS.find(s => s.key === slotKey)
    if (!slot) return null

    return schedule.find(course =>
      course.time.some(
        t => t.day === day && t.start_time === slot.start && t.end_time === slot.end
      )
    )
  }

  const BOX_HEIGHT = 100
  const BORDER_RADIUS = 6

  return (
      <div
        className="bg-white text-gray-900 flex flex-col items-center font-[Vazirmatn]"
        dir="rtl"
        style={{
          width: "95%",
          fontSize: "12px",
          margin: "0 auto",
          borderRadius: `${BORDER_RADIUS}px`,
        }}
      >
      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold mb-1">
          برنامه هفتگی {selectedRoom?.room}
        </h1>
      </div>

      <h2 className="text-lg font-semibold mb-4 text-center">برنامه زمانی</h2>

      <table
        className="border-collapse w-full"
        style={{ tableLayout: "fixed", border: "1px solid #000" }}
      >
        <thead>
          <tr>
            <th
              className="border p-1 text-center text-sm"
              style={{ width: "12%", height: BOX_HEIGHT, borderRadius: BORDER_RADIUS }}
            >
              روز / ساعت
            </th>
            {TIME_SLOTS.map(slot => (
              <th
                key={slot.key}
                className="border p-1 text-center text-sm"
                style={{ height: BOX_HEIGHT, borderRadius: BORDER_RADIUS }}
              >
                {slot.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {DAYS.map(day => (
            <tr key={day}>
              <td
                className="border p-1 text-center text-sm"
                style={{ height: BOX_HEIGHT, borderRadius: BORDER_RADIUS }}
              >
                {day}
              </td>

              {TIME_SLOTS.map(slot => {
                const course = findClass(day, slot.key)
                return (
                  <td
                    key={day + slot.key}
                    className="border text-center"
                    style={{
                      height: BOX_HEIGHT,
                      verticalAlign: "middle",
                      borderRadius: BORDER_RADIUS,
                    }}
                  >
                    {course ? (
                      <div
                        className="flex flex-col items-center justify-center h-full"
                        style={{ borderRadius: BORDER_RADIUS }}
                      >
                        <p className="text-base font-bold">{course.courseName}</p>
                        <p className="text-sm">{course.instructor}</p>
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
  )
}

export default RoomPdfDocument
