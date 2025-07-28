import React from "react";

const days = [
  "شنبه",
  "یکشنبه",
  "دوشنبه",
  "سه‌شنبه",
  "چهارشنبه",
  "پنج‌شنبه",
  "جمعه",
];

const timeSlots = [
  { label: "8:00 - 10:00", key: "8-10" },
  { label: "10:00 - 12:00", key: "10-12" },
  { label: "14:00 - 15:45", key: "14-15_45" },
  { label: "15:45 - 17:30", key: "15_45-17_30" },
  { label: "17:30 - 19:15", key: "17_30-19_15" },
];

const WeeklySchedulePage: React.FC = () => {
  return (
    <div
      className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-4 sm:p-6 font-sans"
      dir="rtl"
    >
      <h1 className="text-2xl sm:text-3xl font-extrabold text-center text-gray-900 mb-4">
        برنامه هفتگی دانشجو
      </h1>
      <p className="text-center text-gray-600 mb-6 text-sm sm:text-base">
        دروس را به زمان‌بندی دلخواه در هفته بکشید و رها کنید.
      </p>

      <div className="overflow-auto rounded-lg shadow-md max-w-full mx-auto">
        <table className="min-w-[700px] sm:min-w-full table-auto border-collapse w-full">
          <thead>
            <tr className="bg-gray-200 text-gray-700 text-sm sm:text-base">
              <th className="p-2 sm:p-3 border border-gray-300 w-24">ساعت</th>
              {days.map((day) => (
                <th
                  key={day}
                  className="p-2 sm:p-3 border border-gray-300 text-center w-28"
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map((slot) => (
              <tr key={slot.key} className="even:bg-white odd:bg-gray-50 text-xs sm:text-sm">
                <td className="p-2 border border-gray-300 text-center font-medium bg-gray-100">
                  {slot.label}
                </td>
                {days.map((day) => (
                  <td
                    key={day + slot.key}
                    className="border border-gray-300 h-16 sm:h-20 hover:bg-indigo-50 transition-colors text-center align-middle"
                    data-day={day}
                    data-slot={slot.key}
                  >
                    {/* future course content */}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WeeklySchedulePage;
