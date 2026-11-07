import type React from "react";
import { useMemo, useState } from "react";
import { BookOpen, Search, X } from "lucide-react";
import type { CourseResponse } from "../../types";

interface CourseListProps {
  courses: CourseResponse[];
  onCourseClick: (course: CourseResponse) => void;
  isLoading: boolean;
}

const normalizeText = (value: string): string =>
  value
    .toLowerCase()
    .replace(/[يى]/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/[\u064B-\u0652\u0640]/g, "")
    .replace(/\u200c/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const CourseList: React.FC<CourseListProps> = ({
  courses,
  onCourseClick,
  isLoading,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCourses = useMemo(() => {
    const term = normalizeText(searchTerm);
    if (!term) return courses;

    return courses.filter((course) =>
      normalizeText(course.course.name).includes(term),
    );
  }, [courses, searchTerm]);

  if (isLoading) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="mb-5 h-6 w-40 animate-pulse rounded-lg bg-slate-100" />
        <div className="mb-5 h-11 animate-pulse rounded-xl bg-slate-100" />
        <div className="flex gap-3 overflow-hidden pb-2">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="h-28 w-56 shrink-0 animate-pulse rounded-2xl bg-slate-100"
            />
          ))}
        </div>
      </div>
    );
  }

  const isSearching = searchTerm.trim().length > 0;

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="mb-4 flex flex-col gap-3 sm:mb-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
            <BookOpen className="h-5 w-5" />
          </span>
          <div>
            <h3 className="font-bold text-slate-900">درس‌های این دپارتمان</h3>
            <p className="mt-0.5 text-xs text-slate-500">
              {isSearching
                ? `${filteredCourses.length} درس از ${courses.length} درس`
                : `${courses.length} درس قابل انتخاب`}
            </p>
          </div>
        </div>
      </div>

      <div className="relative mb-4 sm:mb-5">
        <input
          type="text"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="جست‌وجوی نام درس..."
          aria-label="جست‌وجوی نام درس"
          className="min-h-11 w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-10 pr-10 text-sm text-slate-900 placeholder-slate-400 transition focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-100"
        />
        <Search className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        {isSearching && (
          <button
            type="button"
            onClick={() => setSearchTerm("")}
            aria-label="پاک کردن جست‌وجو"
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-200 hover:text-slate-700"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {filteredCourses.length === 0 ? (
        <div className="col-span-full rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center sm:py-10">
          <BookOpen className="mx-auto mb-3 h-10 w-10 text-slate-300" />
          <p className="text-sm text-slate-500">
            {isSearching
              ? "هیچ درسی با این نام یافت نشد"
              : "هیچ درسی یافت نشد"}
          </p>
        </div>
      ) : (
        <div className="grid grid-flow-col grid-rows-2 auto-cols-[minmax(15rem,19rem)] gap-3 overflow-x-auto pb-2">
          {filteredCourses.map((course) => (
            <button
              key={course.course.id}
              type="button"
              onClick={() => onCourseClick(course)}
              className="group rounded-2xl border border-slate-200 bg-white p-4 text-right transition hover:border-indigo-200 hover:bg-indigo-50/50 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              <span className="flex items-start justify-between gap-3">
                <span className="min-w-0">
                  <span className="block truncate font-bold text-slate-900 group-hover:text-indigo-800">
                    {course.course.name}
                  </span>
                  <span className="mt-1 block truncate text-xs text-slate-500">
                    {course.instructor.name}
                  </span>
                </span>
                <span className="shrink-0 rounded-lg bg-indigo-50 px-2 py-1 text-xs font-bold text-indigo-700">
                  {course.course.units} واحد
                </span>
              </span>
              <span className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
                <span>گروه {course.course.group}</span>
                <span className="font-semibold text-indigo-700">
                  مشاهده جزئیات
                </span>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseList;
