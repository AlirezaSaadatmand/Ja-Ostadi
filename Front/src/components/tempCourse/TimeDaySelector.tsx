import React from "react"

// const TIME_SLOTS = [
//   { label: "08:00 - 10:00", start: "08:00", end: "10:00" },
//   { label: "10:00 - 12:00", start: "10:00", end: "12:00" },
//   { label: "12:00 - 13:30", start: "12:00", end: "13:30" },
//   { label: "13:30 - 15:30", start: "13:30", end: "15:30" },
//   { label: "15:30 - 17:30", start: "15:30", end: "17:30" },
// ]

// const DAYS = ["شنبه", "يک شنبه", "دو شنبه", "سه شنبه", "چهار شنبه"]


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
                <td className="p-2 text-sm font-medium text-gray-700">
                  {day}
                </td>

                {TIME_SLOTS.map((slot) => {
                  const selected =
                    value?.day === day && value?.time === slot.label

                  return (
                    <td
                      key={slot.start}
                      onClick={() => onSelect(day, slot.label)}
                      className={`h-14 cursor-pointer border transition
                        ${
                          selected
                            ? "bg-indigo-200 border-indigo-400"
                            : "hover:bg-gray-100"
                        }`}
                    />
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

export default TimeDaySelector
