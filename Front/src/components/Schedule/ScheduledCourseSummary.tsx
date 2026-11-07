import type React from "react";
import { BookOpen, GraduationCap, ListChecks } from "lucide-react";
import type { CourseResponse } from "../../types";

interface ScheduledCourseSummaryProps {
  scheduledCourses: CourseResponse[];
  onCourseClick: (course: CourseResponse) => void;
}

const ScheduledCourseSummary: React.FC<ScheduledCourseSummaryProps> = ({
  scheduledCourses,
  onCourseClick,
}) => {
  const totalUnits = scheduledCourses.reduce(
    (sum, course) => sum + parseFloat(course.course.units),
    0,
  );

  return (
    <div className="flex max-h-[34rem] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 p-4 sm:p-5">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
            <ListChecks className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <h3 className="truncate font-bold text-slate-900">
              درس‌های انتخاب‌شده
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              {scheduledCourses.length} درس در برنامه
            </p>
          </div>
        </div>
        <span className="flex h-9 min-w-9 shrink-0 items-center justify-center rounded-full bg-violet-50 px-2 text-sm font-extrabold text-violet-700">
          {scheduledCourses.length}
        </span>
      </div>

      <div className="flex shrink-0 items-center justify-between bg-slate-50 px-4 py-3 text-sm sm:px-5">
        <span className="text-slate-600">مجموع واحدها</span>
        <span className="font-extrabold text-slate-900">
          {totalUnits} <span className="text-xs font-medium text-slate-500">واحد</span>
        </span>
      </div>

      <div className="flex-grow space-y-2 overflow-y-auto p-3 sm:p-4">
        {scheduledCourses.length === 0 ? (
          <div className="flex min-h-44 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center">
            <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-400 shadow-sm">
              <BookOpen className="h-6 w-6" />
            </span>
            <p className="font-semibold text-slate-700">هنوز درسی انتخاب نشده</p>
            <p className="mt-1 max-w-xs text-xs leading-5 text-slate-500">
              از فهرست درس‌ها، مورد دلخواه را به برنامه اضافه کنید.
            </p>
          </div>
        ) : (
          scheduledCourses.map((course) => (
            <button
              key={course.course.id}
              type="button"
              onClick={() => onCourseClick(course)}
              className="w-full rounded-2xl border border-slate-200 bg-white p-3 text-right transition hover:border-violet-200 hover:bg-violet-50/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
            >
              <span className="flex items-start justify-between gap-3">
                <span className="min-w-0">
                  <span className="block truncate text-sm font-bold text-slate-900">
                    {course.course.name}
                  </span>
                  <span className="mt-1 flex items-center gap-1 truncate text-xs text-slate-500">
                    <GraduationCap className="h-3.5 w-3.5 shrink-0" />
                    {course.instructor.name}
                  </span>
                </span>
                <span className="shrink-0 rounded-lg bg-violet-50 px-2 py-1 text-xs font-bold text-violet-700">
                  {course.course.units} واحد
                </span>
              </span>
              <span className="mt-3 block border-t border-slate-100 pt-2 text-xs text-slate-500">
                گروه {course.course.group}
              </span>
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default ScheduledCourseSummary;
