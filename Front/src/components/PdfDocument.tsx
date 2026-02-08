import type React from "react";
import type { CourseResponse } from "../types";
import type { TableCell } from "../store/schedule/useScheduleTableStore";
import { IoMdClock } from "react-icons/io";
import { FaBook, FaLayerGroup } from "react-icons/fa";
import { IoPersonSharp } from "react-icons/io5";
import { HiCalendarDateRange } from "react-icons/hi2";

const persianToEnglishDigits = (str: string) =>
  str.replace(/[۰-۹]/g, (d) => "0123456789"["۰۱۲۳۴۵۶۷۸۹".indexOf(d)]);

const parseExamDate = (date?: string) => {
  if (!date) return null;
  const normalized = persianToEnglishDigits(date);
  const [y, m, d] = normalized.split("/").map(Number);
  return new Date(y, m - 1, d);
};


interface PdfDocumentProps {
  scheduledCourses: CourseResponse[];
  table: Record<string, TableCell>;
  days: string[];
  timeSlots: { label: string; key: string; start: string; end: string }[];
  isRotated?: boolean;
}

const PdfDocument: React.FC<PdfDocumentProps> = ({
  scheduledCourses,
  table,
  days,
  timeSlots,
  isRotated = false,
}) => {
  const findMatchingSlotKey = (start: string, end: string) => {
    const normalizedStart = start.padStart(5, "0");
    const normalizedEnd = end.padStart(5, "0");
    return timeSlots.find(
      (slot) => slot.start === normalizedStart && slot.end === normalizedEnd
    )?.key;
  };

  const sortedCourses = [...scheduledCourses].sort((a, b) => {
    const dateA = parseExamDate(a.course.final_exam_date);
    const dateB = parseExamDate(b.course.final_exam_date);

    if (!dateA && !dateB) return 0;
    if (!dateA) return 1;
    if (!dateB) return -1;

    return dateA.getTime() - dateB.getTime();
  });

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

  const renderNormalTable = () => (
    <table
      className="border-collapse bg-white rounded-xl overflow-hidden shadow-lg"
      style={{ width: "100%", tableLayout: "fixed" }}
    >
      <thead>
        <tr className="bg-indigo-50">
          <th
            className="p-6 text-right font-bold text-indigo-900 border-b border-indigo-200 text-3xl"
            style={{ width: "15%" }}
          >
            روز / ساعت
          </th>
          {timeSlots.map((slot) => (
            <th
              key={slot.key}
              className="p-6 text-center font-bold text-indigo-900 border-b border-indigo-200 text-2xl"
            >
              {slot.label}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {days.map((day) => (
          <tr key={day}>
            <td
              className="p-6 font-bold text-indigo-800 bg-indigo-50 border-b border-indigo-100 text-3xl text-center"
              style={{ height: "160px" }}
            >
              {day}
            </td>

            {timeSlots.map((slot) => {
              const slotData = getCourseForSlot(day, slot.key);
              return (
                <td
                  key={day + slot.key}
                  className="border-b border-indigo-100 border-l text-center align-middle"
                  style={{ height: "130px" }}
                >
                  {slotData ? (
                    <div className="w-full h-full bg-indigo-100 border border-indigo-300 rounded-3xl p-6 flex flex-col justify-between">
                      <div>
                        <div className="text-3xl font-bold text-indigo-900 leading-tight">
                          {slotData.course.course.name}
                        </div>
                        <div className="text-2xl text-indigo-700 mt-2">
                          {slotData.course.instructor.name || "—"}
                        </div>
                      </div>

                      {slotData.room && (
                        <div className="mt-3 text-xl bg-yellow-200 text-yellow-900 rounded-full px-4 py-2 font-semibold">
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
  );

  const renderRotatedTable = () => (
    <table
      className="border-collapse bg-white rounded-xl overflow-hidden shadow-lg"
      style={{ width: "100%", tableLayout: "fixed" }}
    >
      <thead>
        <tr className="bg-indigo-50">
          <th
            className="p-6 text-right font-bold text-indigo-900 border-b border-indigo-200 text-3xl"
            style={{ width: "15%" }}
          >
            ساعت / روز
          </th>
          {days.map((day) => (
            <th
              key={day}
              className="p-6 text-center font-bold text-indigo-900 border-b border-indigo-200 text-2xl"
            >
              {day}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {timeSlots.map((slot) => (
          <tr key={slot.key}>
            <td
              className="p-6 font-bold text-indigo-800 bg-indigo-50 border-b border-indigo-100 text-3xl text-center"
              style={{ height: "160px" }}
            >
              {slot.label}
            </td>
            {days.map((day) => {
              const slotData = getCourseForSlot(day, slot.key);
              return (
                <td
                  key={day + slot.key}
                  className="border-b border-indigo-100 border-l text-center align-middle"
                  style={{ height: "130px" }}
                >
                  {slotData ? (
                    <div className="w-full h-full bg-indigo-100 border border-indigo-300 rounded-3xl p-6 flex flex-col justify-between">
                      <div>
                        <div className="text-3xl font-bold text-indigo-900">
                          {slotData.course.course.name}
                        </div>
                        <div className="text-2xl text-indigo-700 mt-2">
                          {slotData.course.instructor.name || "—"}
                        </div>
                      </div>

                      {slotData.room && (
                        <div className="mt-3 text-xl bg-yellow-200 text-yellow-900 rounded-full px-4 py-2 font-semibold">
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
  );

  return (
    <div
      className="p-12 bg-white text-gray-900 font-Vazirmatn"
      dir="rtl"
      style={{ width: "90%", minHeight: "100vh", fontSize: "22px" }}
    >
      <div className="mb-12 text-center">
        <h1 className="text-5xl font-extrabold text-indigo-900 mb-4">
          برنامه هفتگی دانشجو
        </h1>
        <p className="text-gray-700 text-2xl">
          برنامه کلاس‌های هفتگی و دروس انتخاب شده
          {isRotated && (
            <span className="text-blue-600 font-semibold"> (نمایش چرخانده)</span>
          )}
        </p>
      </div>

      <div className="flex flex-col gap-12">
        <div>
          <h2 className="text-3xl font-bold text-indigo-900 mb-8 text-center">
            برنامه هفتگی
          </h2>
          {isRotated ? renderRotatedTable() : renderNormalTable()}
        </div>

        <div style={{ pageBreakBefore: "always" }}>
          <h2 className="text-4xl font-bold text-indigo-900 mb-8 text-center">
            جدول مشخصات دروس به ترتیب تاریخ امتحان پایانی   
          </h2>

          <table
            className="border-collapse w-full bg-white rounded-3xl overflow-hidden shadow-lg"
            style={{ tableLayout: "fixed" }}
          >
            <thead className="bg-indigo-100 text-indigo-900">
              <tr>
                <th className="p-6 border text-2xl font-bold">نام درس</th>
                <th className="p-6 border text-2xl font-bold">استاد</th>
                <th className="p-6 border text-2xl font-bold">گروه</th>
                <th className="p-6 border text-2xl font-bold">واحد</th>
                <th className="p-6 border text-2xl font-bold">تاریخ امتحان</th>
                <th className="p-6 border text-2xl font-bold">ساعت امتحان</th>
              </tr>
            </thead>

            <tbody>
              {sortedCourses.map((item, index) => (
                <tr
                  key={item.course.id}
                  className={
                    index % 2 === 0
                      ? "bg-indigo-50 text-indigo-900"
                      : "bg-white text-gray-800"
                  }
                >
                  <td className="p-6 border text-2xl font-semibold text-center">
                    {item.course.name}
                  </td>
                  <td className="p-6 border text-2xl text-center">
                    <span className="inline-flex items-center gap-3">
                      <IoPersonSharp className="text-indigo-600" />
                      {item.instructor.name}
                    </span>
                  </td>
                  <td className="p-6 border text-2xl text-center">
                    <span className="inline-flex items-center gap-3">
                      <FaLayerGroup className="text-indigo-600" />
                      {item.course.group}
                    </span>
                  </td>
                  <td className="p-6 border text-2xl text-center">
                    <span className="inline-flex items-center gap-3">
                      <FaBook className="text-indigo-600" />
                      {item.course.units}
                    </span>
                  </td>
                  <td className="p-6 border text-2xl text-center">
                    <span className="inline-flex items-center gap-3">
                      <HiCalendarDateRange className="text-yellow-600" />
                      {item.course.final_exam_date || "ندارد"}
                    </span>
                  </td>

                  <td className="p-6 border text-2xl text-center text-nowrap">
                    <span className="inline-flex items-center gap-3">
                      <IoMdClock className="text-yellow-600" />
                      {item.course.final_exam_time || "ندارد"}
                    </span>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PdfDocument;
