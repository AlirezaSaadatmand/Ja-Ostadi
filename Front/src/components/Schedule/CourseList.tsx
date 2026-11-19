import type React from "react";
import { useMemo, useState } from "react";
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
      normalizeText(course.course.name).includes(term)
    );
  }, [courses, searchTerm]);

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-5 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-9 bg-gray-200 rounded mb-4"></div>
        <div className="grid grid-flow-col grid-rows-2 gap-4 pb-2 overflow-x-auto scrollbar-hide auto-cols-max">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-28 w-56 sm:h-28 sm:w-56  bg-gray-200 rounded flex-shrink-0"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  const isSearching = searchTerm.trim().length > 0;

  return (
    <div className="bg-white rounded-lg shadow-sm p-3 sm:p-5">
      <h3 className="text-l sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center justify-center">
        <svg
          className="w-4 h-4 sm:w-5 sm:h-5 ml-2 sm:ml-3 text-emerald-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
        دروس موجود (
        {isSearching
          ? `${filteredCourses.length} از ${courses.length}`
          : courses.length}
        )
      </h3>

      <div className="relative mb-3 sm:mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="جستجوی نام درس..."
          aria-label="جستجوی نام درس"
          className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pr-9 pl-9 text-sm text-gray-900 placeholder-gray-400 transition focus:border-emerald-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-100"
        />
        <svg
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
          />
        </svg>
        {isSearching && (
          <button
            type="button"
            onClick={() => setSearchTerm("")}
            aria-label="پاک کردن جستجو"
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-gray-400 transition hover:bg-gray-200 hover:text-gray-600"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {filteredCourses.length === 0 ? (
        <div className="p-6 sm:p-8 text-center col-span-full">
          <svg
            className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
          <p className="text-gray-500">
            {isSearching
              ? "هیچ درسی با این نام یافت نشد"
              : "هیچ درسی یافت نشد"}
          </p>
        </div>
      ) : (
        <div className="grid grid-flow-col grid-rows-2 gap-2 sm:gap-4 pb-2 overflow-x-auto scrollbar-hide auto-cols-max">
          {filteredCourses.map((course) => (
            <div
              key={course.course.id}
              className="p-3 sm:p-5 rounded-lg bg-gray-50 hover:bg-emerald-50 border border-gray-200 hover:border-emerald-300 transition-all duration-200 cursor-pointer"
              onClick={() => onCourseClick(course)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 text-right ml-1 sm:ml-2">
                  <span className="font-semibold text-gray-900 text-sm sm:text-base block">
                    {course.course.name}
                  </span>
                  <span className="text-xs sm:text-sm text-gray-500 block mt-0.5 sm:mt-1">
                    استاد: {course.instructor.name}
                  </span>
                </div>
                <span className="text-xs sm:text-sm bg-blue-100 text-blue-700 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded flex-shrink-0">
                  {course.course.units} واحد
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseList;