import { useEffect } from "react";
import {
  AlertCircle,
  BookOpen,
  Clock3,
  GraduationCap,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { useScheduleDataStore } from "../store/schedule/useScheduleDataStore";
import {
  useScheduleTableStore,
  days,
  timeSlots,
} from "../store/schedule/useScheduleTableStore";
import { useCourseModalStore } from "../store/schedule/useCourseModalStore";
import { usePdfExportStore } from "../store/common/usePdfExportStore";
import DepartmentList from "../components/Schedule/DepartmentList";
import WeeklyTable from "../components/Schedule/WeeklyTable";
import CourseModal from "../components/Schedule/CourseModal";
import ScheduledCourseSummary from "../components/Schedule/ScheduledCourseSummary";
import CourseList from "../components/Schedule/CourseList";
import Header from "../components/Header";
import config from "../config/config";
import type { CourseResponse } from "../types";
import toast, { Toaster } from "react-hot-toast";

const WeeklySchedulePage = () => {
  const {
    departments,
    isLoadingDepartments,
    isLoadingCourses,
    error,
    fetchDepartments,
    fetchCourses,
    selectedDept,
    setSelectedDept,
    getCoursesByDepartment,
    courses,
  } = useScheduleDataStore();

  const scheduledCourses = useScheduleTableStore(
    (state) => state.scheduledCourses,
  );
  const addCourseToSchedule = useScheduleTableStore(
    (state) => state.addCourseToSchedule,
  );
  const removeCourseFromSchedule = useScheduleTableStore(
    (state) => state.removeCourseFromSchedule,
  );
  const table = useScheduleTableStore((state) => state.table);
  const loadCoursesFromIds = useScheduleTableStore(
    (state) => state.loadCoursesFromIds,
  );
  const isLoadingTable = useScheduleTableStore((state) => state.isLoading);
  const { isExporting, exportPdf } = usePdfExportStore();

  const {
    isOpen: isModalOpen,
    selectedCourse,
    isScheduledCourseInModal,
    openModal,
    closeModal,
  } = useCourseModalStore();

  useEffect(() => {
    const oldStorageKey = "weeklySchedule";
    if (localStorage.getItem(oldStorageKey)) {
      localStorage.removeItem(oldStorageKey);
    }
  }, []);

  useEffect(() => {
    fetchDepartments();
    fetchCourses();
  }, [fetchCourses, fetchDepartments]);

  useEffect(() => {
    if (courses.length > 0 && isLoadingTable) {
      loadCoursesFromIds(courses);
    }
  }, [courses, loadCoursesFromIds, isLoadingTable]);

  const filteredCourses = selectedDept
    ? getCoursesByDepartment(selectedDept)
    : [];
  const selectedDepartment = departments.find(
    (department) => department.id === selectedDept,
  );

  const handleRetry = () => {
    fetchDepartments();
    fetchCourses();
  };

  const handleCourseClick = (course: CourseResponse) => {
    const isScheduled = scheduledCourses.some(
      (scheduled) => scheduled.course.id === course.course.id,
    );
    openModal(course, isScheduled);
  };

  const handleAddToSchedule = (course: CourseResponse) => {
    const conflicts = addCourseToSchedule(course);

    if (conflicts.length > 0) {
      toast.error(
        `درس "${course.course.name}" با برنامه فعلی شما تداخل دارد با: ${conflicts.join(", ")}`,
      );
    } else {
      toast.success(
        `درس "${course.course.name}" با موفقیت به برنامه اضافه شد.`,
      );
    }

    closeModal();
  };

  const handleRemoveCourse = (courseId: number) => {
    const courseName =
      scheduledCourses.find((scheduled) => scheduled.course.id === courseId)
        ?.course.name || "درس";
    removeCourseFromSchedule(courseId);
    toast.success(`${courseName} با موفقیت از برنامه حذف شد.`);
    closeModal();
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f7f8fc] text-slate-900" dir="rtl">
      <Header />

      <main className="mx-auto max-w-7xl px-4 pb-12 pt-24 sm:px-6 sm:pt-28 lg:px-8">
        <section className="relative overflow-hidden rounded-3xl border border-indigo-100 bg-white shadow-[0_12px_40px_rgba(35,42,87,0.07)]">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-l from-indigo-700 via-violet-500 to-sky-400" />
          <div className="relative flex flex-col gap-6 p-5 sm:p-8 lg:flex-row lg:items-center lg:justify-between lg:p-9">
            <div className="max-w-2xl">
              <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700 sm:text-sm">
                <Sparkles className="h-4 w-4" />
                برنامه‌ریزی ترم
              </span>
              <h1 className="text-2xl font-extrabold leading-relaxed text-slate-900 sm:text-3xl lg:text-4xl">
                برنامه هفتگی من
              </h1>
              <p className="mt-2 text-sm leading-7 text-slate-600 sm:text-base">
                درس‌ها را از دپارتمان موردنظر انتخاب کنید و برنامهٔ هفتگی خود را
                به‌سادگی بچینید.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:flex sm:gap-4">
              <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-3 py-3 sm:min-w-40 sm:px-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700">
                  <BookOpen className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs text-slate-500">درس‌های انتخاب‌شده</p>
                  <p className="mt-1 truncate text-lg font-extrabold text-slate-900">
                    {scheduledCourses.length}
                  </p>
                </div>
              </div>
              <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-3 py-3 sm:min-w-40 sm:px-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                  <Clock3 className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs text-slate-500">واحدهای انتخاب‌شده</p>
                  <p className="mt-1 truncate text-lg font-extrabold text-slate-900">
                    {scheduledCourses.reduce(
                      (total, course) => total + Number(course.course.units),
                      0,
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {error && (
          <div
            role="alert"
            className="mt-5 flex flex-col gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-800 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
              <div>
                <p className="font-bold">دریافت اطلاعات برنامه با مشکل روبه‌رو شد</p>
                <p className="mt-1 text-sm leading-6 text-rose-700">
                  اتصال به سرویس برقرار نشد. دوباره تلاش کنید.
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

        <section className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:mt-8 sm:p-6">
          <div className="mb-4 flex items-center gap-3 sm:mb-5">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
              <GraduationCap className="h-6 w-6" />
            </span>
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 sm:text-xl">
                انتخاب دپارتمان
              </h2>
              <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                {selectedDepartment
                  ? `دپارتمان انتخاب‌شده: ${selectedDepartment.name}`
                  : "برای مشاهده درس‌ها، یک دپارتمان انتخاب کنید."}
              </p>
            </div>
          </div>
          <DepartmentList
            departments={Array.isArray(departments) ? departments : []}
            selectedDept={selectedDept}
            onSelect={setSelectedDept}
            isLoading={isLoadingDepartments}
          />
        </section>

        {selectedDept && (
          <section className="mt-5 sm:mt-6" aria-label="درس‌های دپارتمان">
            <CourseList
              courses={filteredCourses}
              onCourseClick={handleCourseClick}
              isLoading={isLoadingCourses}
            />
          </section>
        )}

        <section className="mt-6 grid min-w-0 grid-cols-1 items-start gap-5 lg:mt-8 lg:grid-cols-[minmax(0,1fr)_20rem] xl:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="order-1 min-w-0 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            {isLoadingTable && isLoadingCourses && (
              <div className="flex items-center justify-center gap-3 border-b border-slate-100 bg-indigo-50/60 px-4 py-3 text-sm text-indigo-700">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-700" />
                در حال آماده‌سازی برنامه
              </div>
            )}
            <WeeklyTable
              days={days}
              timeSlots={timeSlots}
              table={table}
              scheduledCourses={scheduledCourses}
              onRemoveCourse={handleRemoveCourse}
              onExportPdf={(data) => exportPdf(data)}
              isExporting={isExporting}
            />
          </div>

          <aside className="order-2 min-w-0 lg:sticky lg:top-28">
            <ScheduledCourseSummary
              scheduledCourses={scheduledCourses}
              onCourseClick={handleCourseClick}
            />
          </aside>
        </section>
      </main>

      <footer className="mt-4 border-t border-slate-200 py-6 sm:mt-6">
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

      <CourseModal
        isOpen={isModalOpen}
        onClose={closeModal}
        course={selectedCourse}
        onAddToSchedule={handleAddToSchedule}
        onRemoveFromSchedule={handleRemoveCourse}
        isScheduledCourse={isScheduledCourseInModal}
      />

      <Toaster position="top-center" />
    </div>
  );
};

export default WeeklySchedulePage;
