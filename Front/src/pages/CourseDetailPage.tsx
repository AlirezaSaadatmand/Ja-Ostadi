import type React from "react";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  Building2,
  CalendarDays,
  Clock3,
  GraduationCap,
  MapPin,
  RefreshCw,
  Sparkles,
  Users,
  UserRound,
} from "lucide-react";
import Header from "../components/Header";
import config from "../config/config";
import { useCourseDetailStore } from "../store/courses/useCourseDetailStore";

const parseLocalizedNumber = (value: string) =>
  Number(
    value
      .replace(/[۰-۹]/g, (digit) =>
        String(digit.charCodeAt(0) - "۰".charCodeAt(0)),
      )
      .replace(/[٠-٩]/g, (digit) =>
        String(digit.charCodeAt(0) - "٠".charCodeAt(0)),
      )
      .replace(/[٬,]/g, "")
      .trim(),
  );

const CourseDetailPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const id = Number(courseId);
  const isValidCourseId = Number.isInteger(id) && id > 0;

  const {
    courseDetail,
    isLoading,
    error,
    fetchCourseDetail,
    clearCourseDetail,
  } = useCourseDetailStore();

  useEffect(() => {
    if (isValidCourseId) {
      fetchCourseDetail(id);
    } else {
      clearCourseDetail();
    }

    return clearCourseDetail;
  }, [id, isValidCourseId, fetchCourseDetail, clearCourseDetail]);

  const handleRetry = () => {
    if (isValidCourseId) {
      fetchCourseDetail(id);
    }
  };

  const showLoading = isLoading || (isValidCourseId && !courseDetail && !error);

  return (
    <div
      className="min-h-screen overflow-x-hidden bg-[#f7f8fc] text-slate-900"
      dir="rtl"
    >
      <Header />

      <main className="mx-auto max-w-7xl px-4 pb-10 pt-24 sm:px-6 sm:pb-12 sm:pt-28 lg:px-8">
        {showLoading ? (
          <section
            aria-label="در حال بارگذاری جزئیات درس"
            className="animate-pulse overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8"
          >
            <div className="h-4 w-32 rounded bg-indigo-100" />
            <div className="mt-5 h-8 w-2/3 rounded bg-slate-200 sm:h-10" />
            <div className="mt-3 h-4 w-full max-w-lg rounded bg-slate-100" />
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }, (_, index) => (
                <div key={index} className="h-24 rounded-2xl bg-slate-100" />
              ))}
            </div>
          </section>
        ) : !isValidCourseId || error || !courseDetail ? (
          <section
            role={error ? "alert" : undefined}
            className="rounded-3xl border border-slate-200 bg-white px-5 py-12 text-center shadow-sm sm:py-16"
          >
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">
              <AlertCircle className="h-8 w-8" />
            </span>
            <h1 className="mt-5 text-xl font-extrabold text-slate-900 sm:text-2xl">
              {isValidCourseId
                ? "جزئیات درس در دسترس نیست"
                : "شناسهٔ درس معتبر نیست"}
            </h1>
            <p className="mx-auto mt-2 max-w-lg break-words text-sm leading-7 text-slate-500">
              {error
                ? "در دریافت اطلاعات درس مشکلی پیش آمد. اتصال را بررسی کنید و دوباره تلاش کنید."
                : "درس موردنظر پیدا نشد یا شناسهٔ واردشده معتبر نیست."}
            </p>
            {error && (
              <p className="mx-auto mt-2 max-w-lg break-words text-xs text-rose-600">
                {error}
              </p>
            )}
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              {isValidCourseId && (
                <button
                  type="button"
                  onClick={handleRetry}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-indigo-700 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700"
                >
                  <RefreshCw className="h-4 w-4" />
                  تلاش دوباره
                </button>
              )}
              <Link
                to="/courses"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700"
              >
                <ArrowRight className="h-4 w-4" />
                بازگشت به فهرست درس‌ها
              </Link>
            </div>
          </section>
        ) : (
          <>
            <div className="mb-5">
              <Link
                to="/courses"
                className="inline-flex min-h-10 items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-white hover:text-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700"
              >
                <ArrowRight className="h-4 w-4" />
                بازگشت به فهرست درس‌ها
              </Link>
            </div>

            {(() => {
              const { Course, Instructor, Department, ClassTime, Semeter } =
                courseDetail;
              const capacity = parseLocalizedNumber(Course.capacity);
              const studentCount = parseLocalizedNumber(Course.student_count);
              const enrollmentPercentage =
                Number.isFinite(capacity) &&
                capacity > 0 &&
                Number.isFinite(studentCount)
                  ? Math.min((studentCount / capacity) * 100, 100)
                  : null;

              const information = [
                {
                  label: "کد درس",
                  value: Course.number,
                  icon: BookOpen,
                  tone: "indigo",
                },
                {
                  label: "گروه",
                  value: Course.group,
                  icon: Users,
                  tone: "violet",
                },
                {
                  label: "واحد",
                  value: Course.units ? `${Course.units} واحد` : "",
                  icon: GraduationCap,
                  tone: "amber",
                },
                {
                  label: "نوع کلاس",
                  value: Course.class_type,
                  icon: BookOpen,
                  tone: "emerald",
                },
              ] as const;
              const toneStyles = {
                indigo: "bg-indigo-100 text-indigo-700",
                violet: "bg-violet-100 text-violet-700",
                amber: "bg-amber-100 text-amber-700",
                emerald: "bg-emerald-100 text-emerald-700",
              };

              return (
                <>
                  <section className="relative overflow-hidden rounded-3xl border border-indigo-100 bg-white shadow-[0_12px_40px_rgba(35,42,87,0.07)]">
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-l from-indigo-700 via-violet-500 to-emerald-400" />
                    <div className="flex flex-col gap-6 p-5 sm:p-8 lg:flex-row lg:items-center lg:justify-between lg:p-9">
                      <div className="min-w-0">
                        <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700 sm:text-sm">
                          <Sparkles className="h-4 w-4" />
                          اطلاعات درس
                        </span>
                        <h1 className="break-words text-2xl font-extrabold leading-relaxed text-slate-900 sm:text-3xl lg:text-4xl">
                          {Course.name}
                        </h1>
                        <div className="mt-4 flex flex-wrap gap-2">
                          <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-700">
                            کد {Course.number || "—"}
                          </span>
                          <span className="rounded-lg bg-violet-50 px-3 py-1.5 text-sm font-semibold text-violet-700">
                            گروه {Course.group || "—"}
                          </span>
                          {Course.units && (
                            <span className="rounded-lg bg-amber-50 px-3 py-1.5 text-sm font-semibold text-amber-700">
                              {Course.units} واحد
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 lg:min-w-72">
                        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                          <p className="text-xs text-slate-500">استاد</p>
                          <p className="mt-2 truncate text-sm font-extrabold text-slate-900">
                            {Instructor.name || "تعیین نشده"}
                          </p>
                        </div>
                        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                          <p className="text-xs text-slate-500">نیمسال</p>
                          <p className="mt-2 truncate text-sm font-extrabold text-slate-900">
                            {Semeter.name || "ثبت نشده"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </section>

                  <div className="mt-6 grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,1fr)_20rem]">
                    <div className="min-w-0 space-y-5">
                      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                        <div className="mb-5 flex items-center gap-3">
                          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700">
                            <BookOpen className="h-6 w-6" />
                          </span>
                          <div>
                            <h2 className="text-lg font-extrabold text-slate-900 sm:text-xl">
                              مشخصات درس
                            </h2>
                            <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                              اطلاعات آموزشی و اجرایی این گروه
                            </p>
                          </div>
                        </div>

                        <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          {information.map(
                            ({ label, value, icon: Icon, tone }) => (
                              <div
                                key={label}
                                className="flex min-w-0 items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4"
                              >
                                <span
                                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${toneStyles[tone]}`}
                                >
                                  <Icon className="h-5 w-5" />
                                </span>
                                <div className="min-w-0">
                                  <dt className="text-xs text-slate-500">
                                    {label}
                                  </dt>
                                  <dd className="mt-1 break-words text-sm font-bold text-slate-900">
                                    {value || "ثبت نشده"}
                                  </dd>
                                </div>
                              </div>
                            ),
                          )}
                        </dl>
                      </section>

                      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                        <div className="mb-5 flex items-center gap-3">
                          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                            <Clock3 className="h-6 w-6" />
                          </span>
                          <div>
                            <h2 className="text-lg font-extrabold text-slate-900 sm:text-xl">
                              زمان‌بندی کلاس
                            </h2>
                            <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                              روز، ساعت و محل برگزاری
                            </p>
                          </div>
                        </div>

                        {ClassTime.length === 0 ? (
                          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center">
                            <Clock3 className="mx-auto h-8 w-8 text-slate-300" />
                            <p className="mt-3 text-sm text-slate-500">
                              زمان برگزاری برای این درس ثبت نشده است.
                            </p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            {ClassTime.map((time, index) => (
                              <article
                                key={`${time.day}-${time.start_time}-${index}`}
                                className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4"
                              >
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                  <span className="rounded-lg bg-white px-3 py-1.5 text-sm font-extrabold text-emerald-800 shadow-sm">
                                    {time.day || "روز ثبت نشده"}
                                  </span>
                                  <span
                                    dir="ltr"
                                    className="inline-flex items-center gap-1.5 text-sm font-bold tabular-nums text-slate-700"
                                  >
                                    <Clock3 className="h-4 w-4 text-emerald-700" />
                                    {time.start_time || "--:--"}–
                                    {time.end_time || "--:--"}
                                  </span>
                                </div>
                                <p className="mt-4 flex items-center gap-2 text-sm text-slate-600">
                                  <MapPin className="h-4 w-4 shrink-0 text-emerald-700" />
                                  {time.room || "مکان ثبت نشده"}
                                </p>
                              </article>
                            ))}
                          </div>
                        )}
                      </section>
                    </div>

                    <aside className="space-y-5 lg:sticky lg:top-28">
                      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="mb-5 flex items-center gap-3">
                          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                            <Users className="h-6 w-6" />
                          </span>
                          <h2 className="text-lg font-extrabold text-slate-900">
                            ظرفیت کلاس
                          </h2>
                        </div>

                        <div className="flex items-end justify-between gap-3">
                          <div>
                            <p className="text-xs text-slate-500">
                              دانشجویان ثبت‌نام‌شده
                            </p>
                            <p className="mt-1 text-2xl font-extrabold text-slate-900">
                              {Course.student_count || "—"}
                              {Course.capacity && (
                                <span className="text-sm font-semibold text-slate-400">
                                  {" "}
                                  / {Course.capacity}
                                </span>
                              )}
                            </p>
                          </div>
                          <span className="rounded-lg bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-800">
                            {Course.capacity ? "ظرفیت" : "نامشخص"}
                          </span>
                        </div>

                        {enrollmentPercentage !== null && (
                          <div
                            className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100"
                            role="progressbar"
                            aria-label="درصد تکمیل ظرفیت کلاس"
                            aria-valuenow={Math.round(enrollmentPercentage)}
                            aria-valuemin={0}
                            aria-valuemax={100}
                          >
                            <div
                              className="h-full rounded-full bg-gradient-to-l from-amber-400 to-orange-500 transition-[width]"
                              style={{ width: `${enrollmentPercentage}%` }}
                            />
                          </div>
                        )}
                      </section>

                      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                        <h2 className="text-lg font-extrabold text-slate-900">
                          اطلاعات آموزشی
                        </h2>
                        <div className="mt-4 space-y-3">
                          <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-3.5">
                            <UserRound className="mt-0.5 h-5 w-5 shrink-0 text-indigo-600" />
                            <div className="min-w-0">
                              <p className="text-xs text-slate-500">استاد</p>
                              {Instructor.id && Instructor.name ? (
                                <Link
                                  to={`/instructors/${Instructor.id}`}
                                  className="mt-1 block break-words text-sm font-bold text-indigo-700 hover:text-indigo-900 hover:underline"
                                >
                                  {Instructor.name}
                                  {Instructor.field
                                    ? ` · ${Instructor.field}`
                                    : ""}
                                </Link>
                              ) : (
                                <p className="mt-1 text-sm font-bold text-slate-800">
                                  {Instructor.name || "ثبت نشده"}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-3.5">
                            <Building2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                            <div className="min-w-0">
                              <p className="text-xs text-slate-500">دپارتمان</p>
                              {Department.id && Department.name ? (
                                <Link
                                  to={`/departments?deptId=${Department.id}`}
                                  className="mt-1 block break-words text-sm font-bold text-emerald-700 hover:text-emerald-900 hover:underline"
                                >
                                  {Department.name}
                                </Link>
                              ) : (
                                <p className="mt-1 text-sm font-bold text-slate-800">
                                  {Department.name || "ثبت نشده"}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-3.5">
                            <CalendarDays className="mt-0.5 h-5 w-5 shrink-0 text-violet-600" />
                            <div className="min-w-0">
                              <p className="text-xs text-slate-500">نیمسال</p>
                              <p className="mt-1 break-words text-sm font-bold text-slate-800">
                                {Semeter.name || "ثبت نشده"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </section>

                      <section className="rounded-3xl border border-rose-100 bg-white p-5 shadow-sm">
                        <div className="flex items-center gap-3">
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-700">
                            <CalendarDays className="h-5 w-5" />
                          </span>
                          <h2 className="text-lg font-extrabold text-slate-900">
                            امتحان پایان‌ترم
                          </h2>
                        </div>
                        <dl className="mt-4 space-y-3">
                          <div className="rounded-2xl bg-rose-50/70 p-3.5">
                            <dt className="text-xs text-slate-500">تاریخ</dt>
                            <dd className="mt-1 text-sm font-bold text-slate-800">
                              {Course.final_exam_date || "اعلام نشده"}
                            </dd>
                          </div>
                          <div className="rounded-2xl bg-rose-50/70 p-3.5">
                            <dt className="text-xs text-slate-500">زمان</dt>
                            <dd className="mt-1 text-sm font-bold text-slate-800">
                              {Course.final_exam_time || "اعلام نشده"}
                            </dd>
                          </div>
                        </dl>
                      </section>
                    </aside>
                  </div>
                </>
              );
            })()}
          </>
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

export default CourseDetailPage;
