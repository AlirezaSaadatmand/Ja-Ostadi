import type React from "react";
import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  BookOpen,
  Building2,
  RefreshCw,
  Search,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { useDepartmentsPageStore } from "../store/departments/useDepartmentsPageStore";
import DepartmentDetailModal from "../components/Department/DepartmentDetailModal";
import Header from "../components/Header";
import type { DepartmentDetail } from "../types";
import config from "../config/config";

const DepartmentsPage: React.FC = () => {
  const { departments, isLoading, error, fetchDepartmentsDetail } =
    useDepartmentsPageStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] =
    useState<DepartmentDetail | null>(null);

  useEffect(() => {
    fetchDepartmentsDetail();
  }, [fetchDepartmentsDetail]);

  const filteredDepartments = useMemo(() => {
    const query = searchQuery.trim().toLocaleLowerCase();
    if (!query) return departments;
    return departments.filter((department) =>
      department.name.toLocaleLowerCase().includes(query),
    );
  }, [departments, searchQuery]);

  const totalInstructors = departments.reduce(
    (total, department) => total + (department.instructors_count || 0),
    0,
  );
  const totalCourses = departments.reduce(
    (total, department) => total + (department.courses_count || 0),
    0,
  );

  const handleDepartmentClick = (department: DepartmentDetail) => {
    setSelectedDepartment(department);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDepartment(null);
  };

  return (
    <div
      className="min-h-screen overflow-x-hidden bg-[#f7f8fc] text-slate-900"
      dir="rtl"
    >
      <Header />

      <main className="mx-auto max-w-7xl px-4 pb-10 pt-24 sm:px-6 sm:pb-12 sm:pt-28 lg:px-8">
        <section className="relative overflow-hidden rounded-3xl border border-indigo-100 bg-white shadow-[0_12px_40px_rgba(35,42,87,0.07)]">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-l from-indigo-700 via-violet-500 to-sky-400" />
          <div className="pointer-events-none absolute -left-20 -top-24 h-64 w-64 rounded-full bg-indigo-50/80 blur-3xl" />
          <div className="relative flex flex-col gap-7 p-5 sm:p-8 lg:flex-row lg:items-center lg:justify-between lg:p-9">
            <div className="max-w-2xl">
              <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700 sm:text-sm">
                <Sparkles className="h-4 w-4" />
                راهنمای آموزشی
              </span>
              <h1 className="text-2xl font-extrabold leading-relaxed text-slate-900 sm:text-3xl lg:text-4xl">
                دپارتمان‌های دانشگاه
              </h1>
              <p className="mt-2 text-sm leading-7 text-slate-600 sm:text-base">
                دپارتمان موردنظرتان را پیدا کنید و از تعداد استادان و درس‌های
                ارائه‌شده باخبر شوید.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:flex sm:gap-4">
              <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-3 py-3 sm:min-w-36 sm:px-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700">
                  <Building2 className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs text-slate-500">دپارتمان‌ها</p>
                  <p className="mt-1 truncate text-lg font-extrabold text-slate-900">
                    {isLoading ? "…" : departments.length}
                  </p>
                </div>
              </div>
              <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-3 py-3 sm:min-w-36 sm:px-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                  <Users className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs text-slate-500">استادان</p>
                  <p className="mt-1 truncate text-lg font-extrabold text-slate-900">
                    {isLoading ? "…" : totalInstructors}
                  </p>
                </div>
              </div>
              <div className="col-span-2 flex min-w-0 items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-3 py-3 sm:col-span-1 sm:min-w-36 sm:px-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
                  <BookOpen className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs text-slate-500">درس‌ها</p>
                  <p className="mt-1 truncate text-lg font-extrabold text-slate-900">
                    {isLoading ? "…" : totalCourses}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:mt-8 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 sm:text-xl">
                فهرست دپارتمان‌ها
              </h2>
              <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                برای دیدن جزئیات و دسترسی به فهرست درس‌ها یا استادان، یک
                دپارتمان را انتخاب کنید.
              </p>
            </div>
            <label className="relative block w-full sm:max-w-sm">
              <span className="sr-only">جست‌وجوی دپارتمان</span>
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
              />
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="نام دپارتمان را جست‌وجو کنید"
                className="min-h-12 w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pr-10 pl-10 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  aria-label="پاک کردن جست‌وجو"
                  className="absolute left-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-200 hover:text-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </label>
          </div>

          <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-500 sm:text-sm">
            <span>
              {isLoading
                ? "در حال دریافت فهرست…"
                : `${filteredDepartments.length} دپارتمان`}
            </span>
            {searchQuery && (
              <span className="max-w-[60%] truncate text-left">
                نتیجه برای «{searchQuery}»
              </span>
            )}
          </div>
        </section>

        {isLoading && (
          <div
            aria-label="در حال بارگذاری دپارتمان‌ها"
            className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {Array.from({ length: 6 }, (_, index) => (
              <div
                key={index}
                className="animate-pulse rounded-3xl border border-slate-200 bg-white p-5 sm:p-6"
              >
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-2xl bg-slate-200" />
                  <div className="flex-1">
                    <div className="h-5 w-3/4 rounded bg-slate-200" />
                    <div className="mt-2 h-3 w-1/2 rounded bg-slate-100" />
                  </div>
                </div>
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="h-16 rounded-2xl bg-slate-100" />
                  <div className="h-16 rounded-2xl bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && error && (
          <section
            role="alert"
            className="mt-5 rounded-3xl border border-rose-200 bg-white px-5 py-10 text-center shadow-sm sm:py-12"
          >
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
              <AlertCircle className="h-7 w-7" />
            </span>
            <h2 className="mt-4 text-lg font-extrabold text-slate-900">
              دریافت دپارتمان‌ها ناموفق بود
            </h2>
            <p className="mx-auto mt-2 max-w-xl break-words text-sm leading-7 text-slate-500">
              {error}
            </p>
            <button
              type="button"
              onClick={fetchDepartmentsDetail}
              className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-indigo-700 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700"
            >
              <RefreshCw className="h-4 w-4" />
              تلاش دوباره
            </button>
          </section>
        )}

        {!isLoading && !error && departments.length === 0 && (
          <section className="mt-5 rounded-3xl border border-slate-200 bg-white px-5 py-12 text-center shadow-sm">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-400">
              <Building2 className="h-8 w-8" />
            </span>
            <h2 className="mt-4 text-lg font-extrabold text-slate-900">
              هنوز دپارتمانی ثبت نشده است
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              فهرست دپارتمان‌ها پس از ثبت در سامانه اینجا نمایش داده می‌شود.
            </p>
          </section>
        )}

        {!isLoading &&
          !error &&
          departments.length > 0 &&
          (filteredDepartments.length > 0 ? (
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredDepartments.map((department, index) => (
                <button
                  key={department.id}
                  type="button"
                  onClick={() => handleDepartmentClick(department)}
                  aria-label={`جزئیات دپارتمان ${department.name}`}
                  className="group relative flex min-h-52 flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 text-right shadow-sm transition duration-200 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-[0_16px_36px_rgba(35,42,87,0.10)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:p-6"
                >
                  <span
                    className={`absolute inset-x-0 top-0 h-1 ${
                      index % 3 === 0
                        ? "bg-indigo-500"
                        : index % 3 === 1
                          ? "bg-emerald-500"
                          : "bg-violet-500"
                    }`}
                  />
                  <span className="flex w-full items-start justify-between gap-3">
                    <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700 transition group-hover:bg-indigo-100">
                      <Building2 className="h-7 w-7" />
                    </span>
                    <span className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition group-hover:bg-indigo-50 group-hover:text-indigo-700">
                      <ArrowLeft className="h-4 w-4" />
                    </span>
                  </span>

                  <span className="mt-5 line-clamp-2 text-lg font-extrabold leading-7 text-slate-900 sm:text-xl">
                    {department.name}
                  </span>
                  <span className="mt-1 text-xs text-slate-500">
                    مشاهده اطلاعات و امکانات دپارتمان
                  </span>

                  <span className="mt-5 grid w-full grid-cols-2 gap-3 border-t border-slate-100 pt-4">
                    <span className="flex min-w-0 items-center gap-2 rounded-xl bg-slate-50 px-3 py-2.5">
                      <Users className="h-4 w-4 shrink-0 text-emerald-600" />
                      <span className="min-w-0">
                        <span className="block truncate text-base font-extrabold text-slate-900">
                          {department.instructors_count}
                        </span>
                        <span className="block text-[11px] text-slate-500">
                          استاد
                        </span>
                      </span>
                    </span>
                    <span className="flex min-w-0 items-center gap-2 rounded-xl bg-slate-50 px-3 py-2.5">
                      <BookOpen className="h-4 w-4 shrink-0 text-violet-600" />
                      <span className="min-w-0">
                        <span className="block truncate text-base font-extrabold text-slate-900">
                          {department.courses_count}
                        </span>
                        <span className="block text-[11px] text-slate-500">
                          درس
                        </span>
                      </span>
                    </span>
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <section className="mt-5 rounded-3xl border border-slate-200 bg-white px-5 py-12 text-center shadow-sm">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                <Search className="h-7 w-7" />
              </span>
              <h2 className="mt-4 text-lg font-extrabold text-slate-900">
                دپارتمانی با این نام پیدا نشد
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                عبارت دیگری را جست‌وجو کنید یا فیلتر را پاک کنید.
              </p>
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="mt-4 inline-flex min-h-10 items-center justify-center rounded-xl px-4 py-2 text-sm font-bold text-indigo-700 transition hover:bg-indigo-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700"
              >
                پاک کردن جست‌وجو
              </button>
            </section>
          ))}
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

      <DepartmentDetailModal
        isOpen={isModalOpen}
        onClose={closeModal}
        department={selectedDepartment}
      />
    </div>
  );
};

export default DepartmentsPage;
