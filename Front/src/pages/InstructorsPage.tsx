import type React from "react";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  AlertCircle,
  Building2,
  CalendarDays,
  GraduationCap,
  RefreshCw,
  Sparkles,
  Users,
} from "lucide-react";
import { useInstructorListStore } from "../store/instructors/useInstructorListStore";
import { useDepartmentsPageStore } from "../store/departments/useDepartmentsPageStore";
import { useSemesterStore } from "../store/common/useSemesterStore";
import InstructorList from "../components/Instructor/InstructorList";
import ToggleFilter from "../components/common/ToggleFilter";
import Header from "../components/Header";
import config from "../config/config";

const InstructorsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    isLoading: isLoadingInstructors,
    error: instructorError,
    fetchInstructors,
    selectedDepartmentId,
    setSelectedDepartmentId,
    selectedSemesterId,
    setSelectedSemesterId,
    filterByMode,
    setFilterByMode,
    getFilteredInstructors,
  } = useInstructorListStore();
  const {
    departments,
    isLoading: isLoadingDepartments,
    error: departmentError,
    fetchDepartmentsDetail,
  } = useDepartmentsPageStore();
  const {
    semesters,
    isLoading: isLoadingSemesters,
    error: semesterError,
    fetchSemesters,
  } = useSemesterStore();

  useEffect(() => {
    fetchInstructors();
    fetchDepartmentsDetail();
    fetchSemesters();
  }, [fetchInstructors, fetchDepartmentsDetail, fetchSemesters]);

  useEffect(() => {
    const urlDeptId = searchParams.get("deptId");
    const urlSemId = searchParams.get("semId");
    const urlMode = searchParams.get("mode");

    if (urlDeptId && !isNaN(Number(urlDeptId))) {
      setSelectedDepartmentId(Number(urlDeptId));
    }
    if (urlSemId && !isNaN(Number(urlSemId))) {
      setSelectedSemesterId(Number(urlSemId));
    }
    if (urlMode === "department" || urlMode === "semester") {
      setFilterByMode(urlMode);
    }
  }, [
    searchParams,
    setSelectedDepartmentId,
    setSelectedSemesterId,
    setFilterByMode,
  ]);

  useEffect(() => {
    if (departments.length > 0 && selectedDepartmentId === null) {
      setSelectedDepartmentId(departments[0].id);
    }
  }, [departments, selectedDepartmentId, setSelectedDepartmentId]);

  useEffect(() => {
    if (semesters.length > 0 && selectedSemesterId === null) {
      setSelectedSemesterId(semesters[0].id);
    }
  }, [semesters, selectedSemesterId, setSelectedSemesterId]);

  useEffect(() => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    if (selectedDepartmentId !== null) {
      newSearchParams.set("deptId", selectedDepartmentId.toString());
    } else {
      newSearchParams.delete("deptId");
    }
    if (selectedSemesterId !== null) {
      newSearchParams.set("semId", selectedSemesterId.toString());
    } else {
      newSearchParams.delete("semId");
    }
    newSearchParams.set("mode", filterByMode);
    setSearchParams(newSearchParams, { replace: true });
  }, [
    selectedDepartmentId,
    selectedSemesterId,
    filterByMode,
    setSearchParams,
    searchParams,
  ]);

  const filteredInstructors = getFilteredInstructors(departments, semesters);
  const selectedDepartment = departments.find(
    (department) => department.id === selectedDepartmentId,
  );
  const selectedSemester = semesters.find(
    (semester) => semester.id === selectedSemesterId,
  );
  const isLoadingFilters = isLoadingDepartments || isLoadingSemesters;
  const pageError = instructorError || departmentError || semesterError;

  const handleDepartmentChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const newDeptId = event.target.value ? Number(event.target.value) : null;
    setSelectedDepartmentId(newDeptId);
  };

  const handleSemesterChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const newSemId = event.target.value ? Number(event.target.value) : null;
    setSelectedSemesterId(newSemId);
  };

  const handleRetry = () => {
    fetchInstructors();
    fetchDepartmentsDetail();
    fetchSemesters();
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
          <div className="flex flex-col gap-6 p-5 sm:p-8 lg:flex-row lg:items-center lg:justify-between lg:p-9">
            <div className="max-w-2xl">
              <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700 sm:text-sm">
                <Sparkles className="h-4 w-4" />
                راهنمای آموزشی
              </span>
              <h1 className="text-2xl font-extrabold leading-relaxed text-slate-900 sm:text-3xl lg:text-4xl">
                استادان دانشگاه
              </h1>
              <p className="mt-2 text-sm leading-7 text-slate-600 sm:text-base">
                استادان را بر اساس دپارتمان یا ترم پیدا کنید و اطلاعات آموزشی
                آن‌ها را ببینید.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:flex sm:gap-4">
              <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-3 py-3 sm:min-w-40 sm:px-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700">
                  <Users className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs text-slate-500">استادان این فهرست</p>
                  <p className="mt-1 truncate text-lg font-extrabold text-slate-900">
                    {isLoadingInstructors ? "…" : filteredInstructors.length}
                  </p>
                </div>
              </div>
              <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-3 py-3 sm:min-w-40 sm:px-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-700">
                  <GraduationCap className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs text-slate-500">فیلتر فعال</p>
                  <p className="mt-1 truncate text-sm font-bold text-slate-900">
                    {filterByMode === "department"
                      ? selectedDepartment?.name || "دپارتمان"
                      : selectedSemester?.name || "ترم"}
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
                جست‌وجو و فیلتر استادان
              </h2>
              <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                دپارتمان یا ترم موردنظر را انتخاب کنید.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label
                htmlFor="department-filter"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                دپارتمان
              </label>
              <div className="relative">
                <Building2 className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <select
                  id="department-filter"
                  className="min-h-12 w-full appearance-none rounded-xl border border-slate-200 bg-white py-3 pr-10 pl-4 text-sm text-slate-800 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                  value={selectedDepartmentId ?? ""}
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

            <div>
              <label
                htmlFor="semester-filter"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                نیمسال تحصیلی
              </label>
              <div className="relative">
                <CalendarDays className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <select
                  id="semester-filter"
                  className="min-h-12 w-full appearance-none rounded-xl border border-slate-200 bg-white py-3 pr-10 pl-4 text-sm text-slate-800 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                  value={selectedSemesterId ?? ""}
                  onChange={handleSemesterChange}
                  disabled={semesters.length === 0 || isLoadingSemesters}
                >
                  {semesters.length === 0 ? (
                    <option value="">
                      {isLoadingSemesters
                        ? "در حال دریافت نیمسال‌ها..."
                        : "نیمسالی در دسترس نیست"}
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
          </div>

          <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500">
                روش نمایش استادان
              </p>
              <p className="mt-1 text-sm text-slate-700">
                {filterByMode === "department"
                  ? `بر اساس دپارتمان${selectedDepartment ? ` · ${selectedDepartment.name}` : ""}`
                  : `بر اساس نیمسال${selectedSemester ? ` · ${selectedSemester.name}` : ""}`}
              </p>
            </div>
            <ToggleFilter
              value={filterByMode}
              onValueChange={setFilterByMode}
            />
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
                  دریافت اطلاعات استادان با مشکل روبه‌رو شد
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

        <section className="mt-6" aria-label="فهرست استادان">
          <div className="mb-4 flex items-end justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-sky-700">کادر آموزشی</p>
              <h2 className="mt-1 text-xl font-extrabold text-slate-900 sm:text-2xl">
                استادان
              </h2>
            </div>
            <span className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-slate-500 shadow-sm">
              {isLoadingInstructors
                ? "در حال بارگذاری..."
                : `${filteredInstructors.length} استاد`}
            </span>
          </div>

          {isLoadingFilters && (
            <div
              aria-label="در حال بارگذاری فیلترها"
              className="mb-4 flex items-center gap-2 rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm text-indigo-700"
            >
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-700" />
              در حال آماده‌سازی فیلترها
            </div>
          )}

          <InstructorList departments={departments} semesters={semesters} />
        </section>
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

export default InstructorsPage;
