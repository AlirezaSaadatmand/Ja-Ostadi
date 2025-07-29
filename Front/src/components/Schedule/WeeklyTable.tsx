import type React from "react"

const days = ["شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنج‌شنبه", "جمعه"]

const timeSlots = [
  { label: "8:00 - 10:00", key: "8-10" },
  { label: "10:00 - 12:00", key: "10-12" },
  { label: "14:00 - 15:45", key: "14-15_45" },
  { label: "15:45 - 17:30", key: "15_45-17_30" },
  { label: "17:30 - 19:15", key: "17_30-19_15" },
]

const WeeklyTable: React.FC = () => {
  return (
    <div className="p-4">
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
                {days.map((day) => (
                  <td
                    key={day + slot.key}
                    className="border-b border-gray-200 h-20 hover:bg-blue-50 transition-colors cursor-pointer relative group border-l"
                    data-day={day}
                    data-slot={slot.key}
                  >
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-8 h-8 border-2 border-dashed border-blue-300 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </div>
                    </div>
                  </td>
                ))}
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
