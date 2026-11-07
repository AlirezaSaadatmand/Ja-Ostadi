import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Clock3 } from "lucide-react";
import { Link } from "react-router-dom";
import { useInstructorDetailStore } from "../../store/instructors/useInstructorDetailStore";

const TIME_SLOTS = [
  { label: "08:00 - 10:00", key: "08:00-10:00", start: "08:00", end: "10:00" },
  { label: "10:00 - 12:00", key: "10:00-12:00", start: "10:00", end: "12:00" },
  { label: "12:00 - 13:30", key: "12:00-13:30", start: "12:00", end: "13:30" },
  { label: "13:30 - 15:30", key: "13:30-15:30", start: "13:30", end: "15:30" },
  { label: "15:30 - 17:30", key: "15:30-17:30", start: "15:30", end: "17:30" },
  { label: "17:30 - 19:30", key: "17:30-19:30", start: "17:30", end: "19:30" },
];

const DAYS = ["شنبه", "يک شنبه", "دو شنبه", "سه شنبه", "چهار شنبه"];

const toMinutes = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

const WeeklyTableView = () => {
  const { instructorCoursesBySemester, isLoadingCourses } =
    useInstructorDetailStore();
  const [selectedSemesterId, setSelectedSemesterId] = useState<number | null>(
    null,
  );

  useEffect(() => {
    if (
      instructorCoursesBySemester.length > 0 &&
      !instructorCoursesBySemester.some(
        (semester) => semester.semester.id === selectedSemesterId,
      )
    ) {
      setSelectedSemesterId(instructorCoursesBySemester[0].semester.id);
    }
  }, [instructorCoursesBySemester, selectedSemesterId]);

  const selectedSemester = instructorCoursesBySemester.find(
    (semester) => semester.semester.id === selectedSemesterId,
  );

  const tableData = useMemo(() => {
    const map = new Map<
      string,
      {
        courseId: number;
        courseName: string;
        room: string;
        startTime: string;
        endTime: string;
      }
    >();

    selectedSemester?.courses.forEach((course) => {
      course.time?.forEach((time) => {
        const courseStart = toMinutes(time.start_time);
        const courseEnd = toMinutes(time.end_time);

        TIME_SLOTS.forEach((slot) => {
          if (
            courseStart < toMinutes(slot.end) &&
            courseEnd > toMinutes(slot.start)
          ) {
            map.set(`${time.day}-${slot.key}`, {
              courseId: course.id,
              courseName: course.name,
              room: time.room,
              startTime: time.start_time,
              endTime: time.end_time,
            });
          }
        });
      });
    });

    return map;
  }, [selectedSemester]);

  const classCount =
    selectedSemester?.courses.reduce(
      (total, course) => total + (course.time?.length ?? 0),
      0,
    ) ?? 0;

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-4 border-b border-slate-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-5">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700">
            <CalendarDays className="h-6 w-6" />
          </span>
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 sm:text-xl">
              برنامهٔ هفتگی استاد
            </h2>
            <p className="mt-1 text-xs text-slate-500 sm:text-sm">
              {classCount} جلسه
              {selectedSemester ? ` · ${selectedSemester.semester.name}` : ""}
            </p>
          </div>
        </div>

        {instructorCoursesBySemester.length > 1 && (
          <label className="flex min-h-10 items-center gap-2 text-sm text-slate-600">
            <span className="shrink-0 font-semibold">نیمسال:</span>
            <select
              value={selectedSemesterId ?? ""}
              onChange={(event) =>
                setSelectedSemesterId(Number(event.target.value))
              }
              className="min-h-10 min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 sm:min-w-48"
            >
              {instructorCoursesBySemester.map((semester) => (
                <option key={semester.semester.id} value={semester.semester.id}>
                  {semester.semester.name}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>

      {isLoadingCourses ? (
        <div
          aria-label="در حال بارگذاری برنامهٔ هفتگی"
          className="animate-pulse p-4 sm:p-6"
        >
          <div className="h-6 w-40 rounded bg-slate-200" />
          <div className="mt-4 h-64 rounded-2xl bg-slate-100" />
        </div>
      ) : !selectedSemester || classCount === 0 ? (
        <div className="px-5 py-10 text-center sm:py-12">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-400">
            <Clock3 className="h-7 w-7" />
          </span>
          <p className="mt-4 text-sm leading-7 text-slate-500">
            {selectedSemester
              ? "برای این نیمسال زمان‌بندی کلاسی ثبت نشده است."
              : "برنامهٔ هفتگی برای این استاد در دسترس نیست."}
          </p>
        </div>
      ) : (
        <>
          <p className="px-4 pt-4 text-xs text-slate-400 sm:hidden">
            برای دیدن همهٔ ساعت‌ها، جدول را به طرفین بکشید.
          </p>
          <div
            className="overflow-x-auto overscroll-x-contain p-4 sm:p-6"
            role="region"
            aria-label="جدول هفتگی استاد، قابل پیمایش افقی"
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
                    className={
                      dayIndex % 2 === 0 ? "bg-white" : "bg-slate-50/50"
                    }
                  >
                    <th
                      scope="row"
                      className="sticky right-0 z-10 h-24 border-b border-l border-slate-200 bg-inherit px-3 py-3 text-sm font-extrabold text-slate-700"
                    >
                      {day}
                    </th>
                    {TIME_SLOTS.map((slot) => {
                      const course = tableData.get(`${day}-${slot.key}`);
                      return (
                        <td
                          key={`${day}-${slot.key}`}
                          className="h-24 border-b border-l border-slate-100 p-1.5"
                        >
                          {course && (
                            <Link
                              to={`/courses/${course.courseId}`}
                              className="flex h-full min-w-0 flex-col justify-center rounded-xl border border-indigo-100 bg-indigo-50 px-2 py-2 text-center transition hover:border-indigo-300 hover:bg-indigo-100"
                            >
                              <span className="line-clamp-2 text-xs font-extrabold leading-5 text-indigo-900">
                                {course.courseName}
                              </span>
                              <span className="mt-1 truncate text-[11px] text-indigo-700">
                                {course.room || "مکان ثبت نشده"}
                              </span>
                              <span
                                dir="ltr"
                                className="mt-1 text-[10px] tabular-nums text-slate-500"
                              >
                                {course.startTime}–{course.endTime}
                              </span>
                            </Link>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
};

export default WeeklyTableView;
