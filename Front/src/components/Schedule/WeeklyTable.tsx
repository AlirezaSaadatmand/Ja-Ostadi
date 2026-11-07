import { forwardRef, useRef, useState } from "react";
import { Download, RotateCw, X } from "lucide-react";
import type { CourseResponse } from "../../types";
import type { TableCell } from "../../store/schedule/useScheduleTableStore";

interface WeeklyTableProps {
  days: string[];
  timeSlots: { label: string; key: string; start: string; end: string }[];
  table: Record<string, TableCell>;
  scheduledCourses: CourseResponse[];
  onRemoveCourse: (courseId: number) => void;
  onExportPdf: (data: {
    scheduledCourses: CourseResponse[];
    table: Record<string, TableCell>;
    days: string[];
    isRotated?: boolean;
    timeSlots: { label: string; key: string; start: string; end: string }[];
  }) => Promise<void>;
  isExporting: boolean;
}

const WeeklyTable = forwardRef<HTMLDivElement, WeeklyTableProps>(
  (
    {
      days,
      timeSlots,
      table,
      onRemoveCourse,
      onExportPdf,
      isExporting,
      scheduledCourses,
    },
    ref,
  ) => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [isRotated, setIsRotated] = useState(false);

    const handleExportPdf = () => {
      onExportPdf({
        scheduledCourses,
        table,
        days,
        timeSlots,
        isRotated,
      });
    };

    const columns = isRotated
      ? days.map((day) => ({ key: day, label: day }))
      : timeSlots.map((slot) => ({ key: slot.key, label: slot.label }));
    const rows = isRotated
      ? timeSlots.map((slot) => ({ key: slot.key, label: slot.label }))
      : days.map((day) => ({ key: day, label: day }));

    return (
      <div className="min-w-0 p-4 sm:p-5 lg:p-6">
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 sm:text-xl">
              جدول برنامه هفتگی
            </h2>
            <p className="mt-1 text-xs text-slate-500 sm:text-sm">
              برای حذف هر درس، دکمهٔ × داخل خانهٔ آن را انتخاب کنید.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:flex">
            <button
              type="button"
              onClick={() => setIsRotated((rotated) => !rotated)}
              data-pdf-exclude
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:px-4 sm:text-sm"
            >
              <RotateCw className="h-4 w-4" />
              {isRotated ? "نمایش معمولی" : "چرخاندن جدول"}
            </button>
            <button
              type="button"
              onClick={handleExportPdf}
              disabled={isExporting}
              data-pdf-exclude
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-indigo-700 px-3 py-2 text-xs font-bold text-white transition hover:bg-indigo-800 disabled:cursor-wait disabled:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700 sm:px-4 sm:text-sm"
            >
              {isExporting ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  در حال آماده‌سازی
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  دریافت PDF
                </>
              )}
            </button>
          </div>
        </div>

        <div
          ref={wrapperRef}
          className="min-w-0 overflow-x-auto rounded-2xl border border-slate-200"
          dir="rtl"
        >
          <div ref={ref} className="min-w-[900px]">
            <table className="w-full table-fixed border-collapse bg-white">
              <thead>
                <tr className="bg-slate-50">
                  <th className="w-28 border-b border-l border-slate-200 px-3 py-4 text-right text-xs font-bold text-slate-600 sm:w-32 sm:text-sm">
                    {isRotated ? "ساعت" : "روز"}
                  </th>
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      className="border-b border-l border-slate-200 px-2 py-4 text-center text-xs font-bold text-slate-600 sm:text-sm"
                    >
                      {column.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr
                    key={row.key}
                    className="text-center transition-colors hover:bg-slate-50/70"
                  >
                    <th
                      scope="row"
                      className="border-b border-l border-slate-200 bg-slate-50/70 px-3 py-3 text-right text-xs font-bold text-slate-700 sm:text-sm"
                    >
                      {row.label}
                    </th>
                    {columns.map((column) => {
                      const day = isRotated ? column.key : row.key;
                      const timeSlotKey = isRotated ? row.key : column.key;
                      const course =
                        table[`${day}-${timeSlotKey}`]?.course || null;

                      return (
                        <td
                          key={`${day}-${timeSlotKey}`}
                          className="group relative h-20 border-b border-l border-slate-100 p-1.5 sm:h-24"
                        >
                          {course && (
                            <div className="absolute inset-1 flex flex-col justify-center rounded-xl border border-indigo-100 bg-indigo-50 px-2 py-2 text-right shadow-sm sm:inset-1.5 sm:px-2.5">
                              <span className="line-clamp-2 text-[11px] font-bold leading-5 text-indigo-950 sm:text-xs">
                                {course.course.name}
                              </span>
                              <span className="mt-0.5 truncate text-[10px] text-indigo-700 sm:text-xs">
                                {course.instructor.name}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  onRemoveCourse(course.course.id)
                                }
                                data-pdf-exclude
                                aria-label={`حذف درس ${course.course.name}`}
                                title="حذف درس"
                                className="absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-lg bg-white text-slate-400 shadow-sm transition hover:bg-rose-100 hover:text-rose-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-rose-600 sm:opacity-0 sm:group-hover:opacity-100"
                              >
                                <X className="h-3.5 w-3.5" />
                              </button>
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
        <p className="mt-3 text-center text-xs text-slate-400 sm:hidden">
          برای دیدن همهٔ روزها، جدول را به طرفین بکشید.
        </p>
      </div>
    );
  },
);

WeeklyTable.displayName = "WeeklyTable";
export default WeeklyTable;
