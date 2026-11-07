import React from "react";
import { Clock3 } from "lucide-react";
import type { RoomScheduleCourse } from "../../types";
import { DAYS, TIME_SLOTS } from "../../store/usefull/useRoomScheduleStore";

interface Props {
  roomSchedule: RoomScheduleCourse[];
}

const toMinutes = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

const RoomWeeklyTableView: React.FC<Props> = ({ roomSchedule }) => {
  return (
    <div className="w-full" dir="rtl">
      <div className="flex flex-col gap-1 border-b border-slate-100 px-4 py-4 sm:px-6 sm:py-5">
        <h2 className="text-lg font-extrabold text-slate-900 sm:text-xl">
          جدول هفتگی کلاس
        </h2>
        <p className="text-xs leading-6 text-slate-500 sm:text-sm">
          درس‌ها و زمان‌های استفاده از این کلاس را در طول هفته ببینید.
        </p>
        <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-slate-400 sm:hidden">
          <span className="h-1 w-5 rounded-full bg-slate-300" />
          برای دیدن همهٔ ساعت‌ها، جدول را به طرفین بکشید.
        </p>
      </div>

      <div
        className="overflow-x-auto overscroll-x-contain"
        role="region"
        aria-label="جدول هفتگی کلاس، قابل پیمایش افقی"
        tabIndex={0}
      >
        <table className="w-full min-w-[850px] table-fixed border-collapse text-right">
          <thead>
            <tr className="bg-slate-50">
              <th
                scope="col"
                className="sticky right-0 z-10 w-28 border-b border-l border-slate-200 bg-slate-50 px-3 py-4 text-sm font-bold text-slate-600"
              >
                روز / ساعت
              </th>
              {TIME_SLOTS.map((slot) => (
                <th
                  key={slot.key}
                  scope="col"
                  className="border-b border-l border-slate-200 px-2 py-4 text-center text-xs font-bold text-slate-600"
                >
                  <span dir="ltr" className="inline-block tabular-nums">
                    {slot.label}
                  </span>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {DAYS.map((day, dayIndex) => (
              <tr
                key={day}
                className={dayIndex % 2 === 0 ? "bg-white" : "bg-slate-50/50"}
              >
                <th
                  scope="row"
                  className="sticky right-0 z-10 h-24 border-b border-l border-slate-200 bg-inherit px-3 py-3 text-sm font-extrabold text-slate-700"
                >
                  {day}
                </th>

                {TIME_SLOTS.map((slot) => {
                  const course = roomSchedule.find((item) =>
                    item.time.some((time) => {
                      if (time.day !== day) return false;
                      const courseStart = toMinutes(time.start_time);
                      const courseEnd = toMinutes(time.end_time);
                      const slotStart = toMinutes(slot.start);
                      const slotEnd = toMinutes(slot.end);
                      return courseStart < slotEnd && courseEnd > slotStart;
                    }),
                  );

                  return (
                    <td
                      key={`${day}-${slot.key}`}
                      className="h-24 border-b border-l border-slate-100 p-1.5"
                    >
                      {course && (
                        <div className="flex h-full min-w-0 flex-col justify-center rounded-xl border border-indigo-100 bg-indigo-50 px-2 py-2 text-center">
                          <span className="line-clamp-2 text-xs font-extrabold leading-5 text-indigo-900">
                            {course.courseName}
                          </span>
                          <span className="mt-1 truncate text-[11px] text-indigo-700">
                            {course.instructor || "استاد ثبت نشده"}
                          </span>
                          <span className="mt-1 inline-flex items-center justify-center gap-1 text-[10px] tabular-nums text-slate-500">
                            <Clock3 className="h-3 w-3" />
                            {course.time.find((time) => time.day === day)
                              ?.start_time || slot.start}
                            –
                            {course.time.find((time) => time.day === day)
                              ?.end_time || slot.end}
                          </span>
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RoomWeeklyTableView;
