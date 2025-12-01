import type React from "react";
import type { CourseResponse } from "../types";
import type { TableCell } from "../store/schedule/useScheduleTableStore";
import { days, timeSlots } from "../store/schedule/useScheduleTableStore";
import { IoMdClock } from "react-icons/io";
import { FaBook, FaLayerGroup } from "react-icons/fa";
import { IoPersonSharp } from "react-icons/io5";
import { HiCalendarDateRange } from "react-icons/hi2";

interface PdfDocumentProps {
  scheduledCourses: CourseResponse[];
  table: Record<string, TableCell>;
}

const PdfDocument: React.FC<PdfDocumentProps> = ({
  scheduledCourses,
  table,
}) => {
  const findMatchingSlotKey = (start: string, end: string) => {
    const normalizedStart = start.padStart(5, "0");
    const normalizedEnd = end.padStart(5, "0");
    return timeSlots.find(
      (slot) => slot.start === normalizedStart && slot.end === normalizedEnd
    )?.key;
  };

  const getCourseForSlot = (day: string, timeSlotKey: string) => {
    const key = `${day}-${timeSlotKey}`;
    const cell = table[key];
    if (!cell || !cell.course) return null;

    const time = cell.course.time.find(
      (t) =>
        t.day === day &&
        findMatchingSlotKey(t.start_time, t.end_time) === timeSlotKey
    );

    return { course: cell.course, room: time?.room || "" };
  };

  // const totalUnits = scheduledCourses.reduce(
  //   (sum, course) => sum + parseFloat(course.course.units),
  //   0
  // );

  return (
    <div
      className="p-10 bg-white text-gray-900 font-Vazirmatn"
      dir="rtl"
      style={{ width: "90%", minHeight: "100vh", fontSize: "20px" }}
    >
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
          برنامه هفتگی دانشجو
        </h1>
        <p className="text-gray-700 text-xl">
          برنامه کلاس‌های هفتگی و دروس انتخاب شده
        </p>
      </div>

      <div className="flex flex-col gap-8">
        {/* Weekly Table */}
        <div className="flex-[3]">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            برنامه هفتگی
          </h2>

          <table
            className="border-collapse bg-white rounded-xl overflow-hidden shadow-lg"
            style={{ width: "100%", tableLayout: "fixed" }}
          >
            <thead>
              <tr className="bg-gray-100">
                <th
                  className="p-4 text-right font-bold text-gray-800 border-b border-gray-300 text-2xl"
                  style={{ width: "15%" }}
                >
                  روز / ساعت
                </th>

                {timeSlots.map((slot) => (
                  <th
                    key={slot.key}
                    className="p-4 text-center font-bold text-gray-800 border-b border-gray-300 text-xl"
                    style={{ width: `${85 / timeSlots.length}%` }}
                  >
                    {slot.label}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {days.map((day) => (
                <tr key={day} className="hover:bg-gray-50 transition-colors">
                  <td
                    className="p-4 font-semibold text-gray-700 bg-gray-50 border-b border-gray-200 text-3xl text-center"
                    style={{ height: "140px" }}
                  >
                    {day}
                  </td>

                  {timeSlots.map((slot) => {
                    const slotData = getCourseForSlot(day, slot.key);
                    return (
                      <td
                        key={day + slot.key}
                        className="border-b border-gray-200 transition-colors relative border-l text-center align-middle"
                        style={{ height: "100px" }}
                      >
                        {slotData ? (
                          <div className="w-full h-full bg-indigo-100 border border-indigo-300 rounded-2xl p-4 flex flex-col justify-between">
                            <div>
                              <div className="text-2xl font-bold text-indigo-900 leading-tight break-words">
                                {slotData.course.course.name}
                              </div>
                              <div className="text-2xl text-indigo-700 mt-2 leading-tight break-words">
                                {slotData.course.instructor.name || "—"}
                              </div>
                            </div>

                            {slotData.room && (
                              <div className="mt-3 text-lg bg-yellow-200 text-yellow-900 rounded-xl px-2 py-1 text-center font-semibold">
                                {slotData.room}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="w-full h-full"></div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {scheduledCourses.map((item) => (
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 print:shadow-none print:border-gray-300 w-auto">
              <div className="bg-[#e0e7ff] p-4 text-white">
                <h2 className="text-3xl font-bold text-center text-[#4338ca]">
                  {item.course.name}
                </h2>
              </div>

              <div className="p-4 text-sm space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 flex items-center gap-2 text-3xl pr-10 pt-3">
                    <IoPersonSharp /> استاد:
                  </span>
                  <span className="font-medium text-gray-800 mx-auto text-3xl pt-3">
                    {item.instructor.name}
                  </span>
                </div>

                <div className="flex">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 flex items-center gap-2 text-3xl pr-10">
                      <FaLayerGroup /> گروه:
                    </span>
                    <span className="font-medium bg-[#dcfce7] text-[#15803d] p-1 px-8 rounded-2xl justify-center items-center flex w-5 text-center mx-auto text-3xl">
                      {item.course.group}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 flex items-center gap-2 text-3xl pr-10">
                      <FaBook /> واحد:
                    </span>
                    <span className="font-medium text-[#7e22ce] bg-[#f3e8ff] p-1 rounded-2xl w-5 text-center px-8 justify-center items-center flex mx-auto text-3xl">
                      {item.course.units}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-500 flex items-center gap-2 text-3xl pr-10">
                    <HiCalendarDateRange /> تاریخ امتحان:
                  </span>
                  <div className="text-gray-800 mx-auto text-3xl text-center">
                    {item.course.final_exam_date}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-500 flex items-center gap-2 text-3xl pr-10 pb-2">
                    <IoMdClock /> ساعت امتحان:
                  </span>
                  <div className="text-gray-800 mx-auto text-3xl text-center text-nowrap pb-2">
                    {item.course.final_exam_time}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PdfDocument;
