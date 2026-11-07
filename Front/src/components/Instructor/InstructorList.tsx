import type React from "react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, BookUser, Search, UserRound } from "lucide-react";
import { useInstructorListStore } from "../../store/instructors/useInstructorListStore";
import type { Department, Semester } from "../../types";

interface InstructorListProps {
  departments: Department[];
  semesters: Semester[];
}

const InstructorList: React.FC<InstructorListProps> = ({
  departments,
  semesters,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const { isLoading, error, getFilteredInstructors } = useInstructorListStore();

  const filteredInstructors = getFilteredInstructors(departments, semesters);
  const instructors = useMemo(() => {
    const query = searchQuery.trim().toLocaleLowerCase();
    const namedInstructors = filteredInstructors.filter((item) =>
      item.instructor?.name?.trim(),
    );

    if (!query) return namedInstructors;

    return namedInstructors.filter((item) =>
      `${item.instructor.name} ${item.instructor.field}`
        .toLocaleLowerCase()
        .includes(query),
    );
  }, [filteredInstructors, searchQuery]);

  if (isLoading) {
    return (
      <>
        <div className="relative mb-4">
          <Search className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            disabled
            aria-label="جست‌وجوی استاد"
            placeholder="نام استاد یا رشته..."
            className="min-h-12 w-full rounded-xl border border-slate-200 bg-slate-100 py-3 pr-10 pl-4 text-sm text-slate-900 placeholder:text-slate-400"
          />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <div
              key={index}
              className="min-h-48 animate-pulse rounded-2xl border border-slate-200 bg-white p-5"
            >
              <div className="mb-5 flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-slate-200" />
                <div className="flex-1">
                  <div className="mb-2 h-4 w-3/4 rounded bg-slate-200" />
                  <div className="h-3 w-1/2 rounded bg-slate-100" />
                </div>
              </div>
              <div className="h-10 rounded-xl bg-slate-100" />
            </div>
          ))}
        </div>
      </>
    );
  }

  if (error) return null;

  return (
    <>
      <div className="relative mb-4">
        <Search className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          aria-label="جست‌وجوی استاد"
          placeholder="نام استاد یا رشته را جست‌وجو کنید..."
          className="min-h-12 w-full rounded-xl border border-slate-200 bg-white py-3 pr-10 pl-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
        />
      </div>

      {instructors.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white px-5 py-12 text-center shadow-sm sm:py-16">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-50 text-sky-500">
            <BookUser className="h-8 w-8" />
          </span>
          <h3 className="mt-5 text-lg font-extrabold text-slate-900">
            {filteredInstructors.length > 0
              ? "استادی با این عبارت پیدا نشد"
              : "استادی برای این فیلترها پیدا نشد"}
          </h3>
          <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-slate-500">
            {filteredInstructors.length > 0
              ? "نام استاد یا رشتهٔ دیگری را جست‌وجو کنید."
              : "دپارتمان، نیمسال یا روش نمایش دیگری را انتخاب کنید."}
          </p>
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="mt-5 rounded-xl border border-indigo-200 px-4 py-2 text-sm font-bold text-indigo-700 transition hover:bg-indigo-50"
            >
              پاک‌کردن جست‌وجو
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {instructors.map((item, index) => (
            <Link
              key={`${item.relations.instructor_id}-${index}`}
              to={`/instructors/${item.relations.instructor_id}`}
              className="group flex min-h-52 min-w-0 flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_4px_14px_rgba(15,23,42,0.04)] transition duration-200 hover:-translate-y-1 hover:border-sky-200 hover:shadow-[0_14px_32px_rgba(14,116,144,0.1)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 motion-reduce:transform-none sm:p-6"
            >
              <div className="mb-5 flex items-start justify-between gap-3">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-700 transition group-hover:bg-sky-600 group-hover:text-white">
                  <UserRound className="h-6 w-6" />
                </span>
                <span className="mt-2 h-1.5 w-10 rounded-full bg-sky-500" />
              </div>

              <h3 className="break-words text-lg font-extrabold leading-7 text-slate-900">
                {item.instructor.name}
              </h3>
              <p className="mt-2 flex min-w-0 items-center gap-2 text-sm text-slate-600">
                <BookUser className="h-4 w-4 shrink-0 text-slate-400" />
                <span className="truncate">
                  {item.instructor.field || "رشته ثبت نشده"}
                </span>
              </p>

              <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-bold text-indigo-700 transition group-hover:gap-2.5">
                مشاهده پروفایل استاد
                <ArrowLeft className="h-4 w-4" />
              </span>
            </Link>
          ))}
        </div>
      )}
    </>
  );
};

export default InstructorList;
