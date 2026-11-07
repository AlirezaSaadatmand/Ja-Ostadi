import type React from "react";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useCoursesPageStore } from "../store/courses/useCoursesPageStore";
import { useSemesterStore } from "../store/common/useSemesterStore";
import { useDepartmentsPageStore } from "../store/departments/useDepartmentsPageStore";
import {
  AlertCircle,
  ArrowLeft,
  BookOpen,
  Building2,
  CalendarDays,
  Clock3,
  GraduationCap,
  RefreshCw,
  Search,
  Sparkles,
  UserRound,
} from "lucide-react";
import Header from "../components/Header";
import config from "../config/config";

const CoursesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [areUrlFiltersInitialized, setAreUrlFiltersInitialized] =
    useState(false);

  const {
    courses,
    isLoading,
    error,
    fetchCourses,
    selectedSemesterId,
    setSelectedSemesterId,
    selectedDepartmentId,
    setSelectedDepartmentId,
  } = useCoursesPageStore();

  const {
    semesters,
    isLoading: isLoadingSemesters,
    error: semesterError,
    fetchSemesters,
  } = useSemesterStore();
  const {
    departments,
    isLoading: isLoadingDepartments,
    error: departmentError,
    fetchDepartmentsDetail,
  } = useDepartmentsPageStore();

  useEffect(() => {
    fetchSemesters();
    fetchDepartmentsDetail();
  }, [fetchSemesters, fetchDepartmentsDetail]);

  useEffect(() => {
    const urlSemId = searchParams.get("semId");
    const urlDeptId = searchParams.get("deptId");

    if (urlSemId && !isNaN(Number(urlSemId))) {
      setSelectedSemesterId(Number(urlSemId));
    }
    if (urlDeptId && !isNaN(Number(urlDeptId))) {
      setSelectedDepartmentId(Number(urlDeptId));
    }
    setAreUrlFiltersInitialized(true);
  }, [searchParams, setSelectedSemesterId, setSelectedDepartmentId]);

  useEffect(() => {
    if (!areUrlFiltersInitialized) return;
    if (semesters.length > 0 && selectedSemesterId === null) {
      setSelectedSemesterId(semesters[0].id);
    }
  }, [
    areUrlFiltersInitialized,
    semesters,
    selectedSemesterId,
    setSelectedSemesterId,
  ]);

  useEffect(() => {
    if (!areUrlFiltersInitialized) return;
    if (departments.length > 0 && selectedDepartmentId === null) {
      setSelectedDepartmentId(departments[0].id);
    }
  }, [
    areUrlFiltersInitialized,
    departments,
    selectedDepartmentId,
    setSelectedDepartmentId,
  ]);

  useEffect(() => {
    if (selectedSemesterId !== null && selectedDepartmentId !== null) {
      fetchCourses(selectedSemesterId, selectedDepartmentId);
    }
  }, [selectedSemesterId, selectedDepartmentId, fetchCourses]);

  useEffect(() => {
    if (!areUrlFiltersInitialized) return;
    const newSearchParams = new URLSearchParams(searchParams.toString());
    if (selectedSemesterId !== null) {
      newSearchParams.set("semId", selectedSemesterId.toString());
    } else {
      newSearchParams.delete("semId");
    }
    if (selectedDepartmentId !== null) {
      newSearchParams.set("deptId", selectedDepartmentId.toString());
    } else {
      newSearchParams.delete("deptId");
    }
    setSearchParams(newSearchParams, { replace: true });
  }, [
    areUrlFiltersInitialized,
    selectedSemesterId,
    selectedDepartmentId,
    setSearchParams,
    searchParams,
  ]);

  const handleSemesterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSemId = e.target.value ? Number(e.target.value) : null;
    setSelectedSemesterId(newSemId);
  };

  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDeptId = e.target.value ? Number(e.target.value) : null;
    setSelectedDepartmentId(newDeptId);
  };

  const filteredCourses = useMemo(() => {
    const query = searchQuery.trim().toLocaleLowerCase();
    if (!query) return courses;

    return courses.filter((course) => {
      const searchableText = [
        course.name,
        course.instructor_name,
        ...(course.class_times ?? []).flatMap((time) => [
          time.day,
          time.start_time,
          time.end_time,
          time.room,
        ]),
      ]
        .filter(Boolean)
        .join(" ")
        .toLocaleLowerCase();

      return searchableText.includes(query);
    });
  }, [courses, searchQuery]);

  const selectedSemester = semesters.find(
    (semester) => semester.id === selectedSemesterId,
  );
  const selectedDepartment = departments.find(
    (department) => department.id === selectedDepartmentId,
  );
  const pageError = error || semesterError || departmentError;

  const handleRetry = () => {
    fetchSemesters();
    fetchDepartmentsDetail();
    if (selectedSemesterId !== null && selectedDepartmentId !== null) {
      fetchCourses(selectedSemesterId, selectedDepartmentId);
    }
  };

  return (
    <div
      className="min-h-screen overflow-x-hidden bg-[#f7f8fc] text-slate-900"
      dir="rtl"
    >
      <Header />

      <main className="mx-auto max-w-7xl px-4 pb-10 pt-24 sm:px-6 sm:pb-12 sm:pt-28 lg:px-8">
        <section className="relative overflow-hidden rounded-3xl border border-indigo-100 bg-white shadow-[0_12px_40px_rgba(35,42,87,0.07)]">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-l from-indigo-700 via-violet-500 to-emerald-400" />
          <div className="flex flex-col gap-6 p-5 sm:p-8 lg:flex-row lg:items-center lg:justify-between lg:p-9">
            <div className="max-w-2xl">
              <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700 sm:text-sm">
                <Sparkles className="h-4 w-4" />
                راهنمای آموزشی
              </span>
              <h1 className="text-2xl font-extrabold leading-relaxed text-slate-900 sm:text-3xl lg:text-4xl">
                درس‌های دانشگاه
              </h1>
              <p className="mt-2 text-sm leading-7 text-slate-600 sm:text-base">
                درس موردنظر را بر اساس ترم و دپارتمان پیدا کنید و زمان‌بندی و
                اطلاعات آن را ببینید.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:flex sm:gap-4">
              <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-3 py-3 sm:min-w-40 sm:px-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700">
                  <BookOpen className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs text-slate-500">درس‌های این فهرست</p>
                  <p className="mt-1 truncate text-lg font-extrabold text-slate-900">
                    {isLoading ? "…" : filteredCourses.length}
                  </p>
                </div>
              </div>
              <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-3 py-3 sm:min-w-40 sm:px-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                  <Building2 className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs text-slate-500">دپارتمان انتخاب‌شده</p>
                  <p className="mt-1 truncate text-sm font-bold text-slate-900">
                    {selectedDepartment?.name || "انتخاب نشده"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:mt-8 sm:p-6">
          <div className="mb-5 flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
              <GraduationCap className="h-6 w-6" />
            </span>
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 sm:text-xl">
                جست‌وجو و فیلتر درس‌ها
              </h2>
              <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                ابتدا ترم و دپارتمان را انتخاب کنید.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label
                htmlFor="course-search"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                جست‌وجوی درس یا استاد
              </label>
              <div className="relative">
                <Search className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  id="course-search"
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="نام درس، استاد یا روز برگزاری..."
                  className="min-h-12 w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pr-10 pl-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="semester-filter"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                انتخاب ترم
              </label>
              <div className="relative">
                <CalendarDays className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <select
                  id="semester-filter"
                  className="min-h-12 w-full appearance-none rounded-xl border border-slate-200 bg-white py-3 pr-10 pl-4 text-sm text-slate-800 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                  value={selectedSemesterId !== null ? selectedSemesterId : ""}
                  onChange={handleSemesterChange}
                  disabled={semesters.length === 0 || isLoadingSemesters}
                >
                  {semesters.length === 0 ? (
                    <option value="">
                      {isLoadingSemesters
                        ? "در حال دریافت ترم‌ها..."
                        : "ترمی در دسترس نیست"}
                    </option>
                  ) : (
                    semesters.map((semester) => (
                      <option key={semester.id} value={semester.id}>
                        {semester.name}
                      </option>
                    ))
                  )}
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="department-filter"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                انتخاب دپارتمان
              </label>
              <div className="relative">
                <Building2 className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <select
                  id="department-filter"
                  className="min-h-12 w-full appearance-none rounded-xl border border-slate-200 bg-white py-3 pr-10 pl-4 text-sm text-slate-800 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                  value={
                    selectedDepartmentId !== null ? selectedDepartmentId : ""
                  }
                  onChange={handleDepartmentChange}
                  disabled={departments.length === 0 || isLoadingDepartments}
                >
                  {departments.length === 0 ? (
                    <option value="">
                      {isLoadingDepartments
                        ? "در حال دریافت دپارتمان‌ها..."
                        : "دپارتمانی در دسترس نیست"}
                    </option>
                  ) : (
                    departments.map((department) => (
                      <option key={department.id} value={department.id}>
                        {department.name}
                      </option>
                    ))
                  )}
                </select>
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-4 text-sm">
            <p className="text-slate-500">
              {selectedSemester ? `${selectedSemester.name} · ` : ""}
              {selectedDepartment?.name || "همهٔ دپارتمان‌ها"}
            </p>
            <p className="font-bold text-indigo-700">
              {isLoading
                ? "در حال بارگذاری..."
                : `${filteredCourses.length} درس`}
            </p>
          </div>
        </section>

        {pageError && (
          <div
            role="alert"
            className="mt-5 flex flex-col gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-800 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
              <div>
                <p className="font-bold">
                  دریافت اطلاعات درس‌ها با مشکل روبه‌رو شد
                </p>
                <p className="mt-1 text-sm leading-6 text-rose-700">
                  اتصال به سرویس برقرار نشد. دوباره تلاش کنید.
                </p>
                <p className="mt-1 break-words text-xs text-rose-600">
                  {pageError}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleRetry}
              className="inline-flex min-h-10 items-center justify-center gap-2 self-start rounded-xl border border-rose-200 bg-white px-4 py-2 text-sm font-bold text-rose-700 transition hover:bg-rose-100 sm:self-auto"
            >
              <RefreshCw className="h-4 w-4" />
              تلاش دوباره
            </button>
          </div>
        )}

        {isLoading && (
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }, (_, index) => (
              <div
                key={index}
                className="min-h-52 animate-pulse rounded-2xl border border-slate-200 bg-white p-5"
              >
                <div className="mb-5 flex items-center gap-3">
                  <div className="h-11 w-11 rounded-xl bg-slate-200" />
                  <div className="flex-1">
                    <div className="mb-2 h-4 w-3/4 rounded bg-slate-200" />
                    <div className="h-3 w-1/2 rounded bg-slate-100" />
                  </div>
                </div>
                <div className="h-10 rounded-xl bg-slate-100" />
              </div>
            ))}
          </div>
        )}

        {!isLoading && !pageError && filteredCourses.length === 0 && (
          <div className="mt-6 rounded-3xl border border-slate-200 bg-white px-5 py-12 text-center shadow-sm sm:py-16">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-400">
              <BookOpen className="h-8 w-8" />
            </span>
            <h2 className="mt-5 text-lg font-extrabold text-slate-900">
              {courses.length > 0
                ? "درسی با این عبارت پیدا نشد"
                : "درسی برای این فیلترها پیدا نشد"}
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-slate-500">
              {courses.length > 0
                ? "عبارت جست‌وجو را تغییر دهید یا آن را پاک کنید."
                : "ترم یا دپارتمان دیگری را انتخاب کنید و دوباره بررسی کنید."}
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
        )}

        {!isLoading && !pageError && filteredCourses.length > 0 && (
          <section className="mt-6" aria-label="فهرست درس‌ها">
            <div className="mb-4 flex items-end justify-between gap-3">
              <div>
                <p className="text-sm font-bold text-emerald-700">
                  فهرست درس‌ها
                </p>
                <h2 className="mt-1 text-xl font-extrabold text-slate-900 sm:text-2xl">
                  درس‌های ارائه‌شده
                </h2>
              </div>
              <span className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-slate-500 shadow-sm">
                {filteredCourses.length} مورد
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filteredCourses.map((course) => (
                <Link
                  key={course.id}
                  to={`/courses/${course.id}`}
                  className="group flex min-h-56 min-w-0 flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_4px_14px_rgba(15,23,42,0.04)] transition duration-200 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-[0_14px_32px_rgba(16,120,87,0.1)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 motion-reduce:transform-none sm:p-6"
                >
                  <div className="mb-5 flex items-start justify-between gap-3">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 transition group-hover:bg-emerald-600 group-hover:text-white">
                      <BookOpen className="h-6 w-6" />
                    </span>
                    <span className="mt-2 h-1.5 w-10 rounded-full bg-emerald-500" />
                  </div>

                  <h3 className="text-lg font-extrabold leading-7 text-slate-900">
                    {course.name}
                  </h3>
                  <p className="mt-2 flex items-center gap-2 text-sm text-slate-600">
                    <UserRound className="h-4 w-4 shrink-0 text-slate-400" />
                    <span className="truncate">
                      {course.instructor_name || "استاد مشخص نشده"}
                    </span>
                  </p>

                  <div className="mt-5 border-t border-slate-100 pt-4">
                    {course.class_times?.length ? (
                      <div className="flex flex-wrap gap-2">
                        {course.class_times.map((classTime, index) => (
                          <span
                            key={`${classTime.day}-${classTime.start_time}-${index}`}
                            className="inline-flex max-w-full items-center gap-1.5 rounded-lg border border-emerald-100 bg-emerald-50 px-2.5 py-1.5 text-xs font-medium text-emerald-800"
                          >
                            <Clock3 className="h-3.5 w-3.5 shrink-0" />
                            <span>{classTime.day}</span>
                            <span dir="ltr" className="tabular-nums">
                              {classTime.start_time}–{classTime.end_time}
                            </span>
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400">
                        زمان برگزاری ثبت نشده است
                      </p>
                    )}
                  </div>

                  <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-bold text-indigo-700 transition group-hover:gap-2.5">
                    مشاهده جزئیات
                    <ArrowLeft className="h-4 w-4" />
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <footer className="border-t border-slate-200 py-6">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 text-center sm:flex-row sm:px-6 sm:text-right lg:px-8">
          <p className="text-sm text-slate-500">
            جا استادی؛ راهی ساده برای دسترسی به اطلاعات دانشگاهی.
          </p>
          <a
            href={
              config.projectUrl ||
              "https://github.com/AlirezaSaadatmand/Ja-Ostadi"
            }
            target="_blank"
            rel="noopener noreferrer"
            aria-label="مشاهده پروژه جا استادی در گیت‌هاب"
            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <span>پروژه در گیت‌هاب</span>
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="currentColor"
            >
              <path d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.56.1.76-.24.76-.54v-2.1c-3.1.67-3.76-1.32-3.76-1.32-.5-1.28-1.23-1.62-1.23-1.62-1-.68.08-.67.08-.67 1.1.08 1.68 1.14 1.68 1.14.98 1.68 2.58 1.2 3.2.92.1-.72.39-1.2.7-1.48-2.48-.28-5.08-1.24-5.08-5.52 0-1.22.44-2.21 1.15-2.99-.12-.28-.5-1.42.1-2.95 0 0 .94-.3 3.05 1.14a10.6 10.6 0 0 1 5.55 0c2.11-1.44 3.05-1.14 3.05-1.14.61 1.53.23 2.67.11 2.95.72.78 1.15 1.77 1.15 2.99 0 4.29-2.61 5.23-5.1 5.5.4.35.74 1.02.74 2.06v3.05c0 .3.2.65.77.54A11.1 11.1 0 0 0 12 .9Z" />
            </svg>
          </a>
        </div>
      </footer>
    </div>
  );
};

export default CoursesPage;
