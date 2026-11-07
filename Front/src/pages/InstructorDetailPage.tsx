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
  Mail,
  MapPin,
  RefreshCw,
  Sparkles,
  UserRound,
} from "lucide-react";
import Header from "../components/Header";
import CommentSection from "../components/Instructor/CommentSection";
import WeeklyTableView from "../components/Instructor/WeeklyTableView";
import config from "../config/config";
import { useInstructorDetailStore } from "../store/instructors/useInstructorDetailStore";

const InstructorDetailPage: React.FC = () => {
  const { instructorId } = useParams<{ instructorId: string }>();
  const id = Number(instructorId);
  const isValidInstructorId = Number.isInteger(id) && id > 0;

  const {
    instructorDetail,
    instructorCoursesBySemester,
    isLoadingDetail,
    isLoadingCourses,
    detailError,
    coursesError,
    fetchInstructorDetail,
    fetchInstructorCoursesBySemester,
    clearInstructorData,
  } = useInstructorDetailStore();

  useEffect(() => {
    if (isValidInstructorId) {
      fetchInstructorDetail(id);
      fetchInstructorCoursesBySemester(id);
    } else {
      clearInstructorData();
    }

    return clearInstructorData;
  }, [
    id,
    isValidInstructorId,
    fetchInstructorDetail,
    fetchInstructorCoursesBySemester,
    clearInstructorData,
  ]);

  const handleRetry = () => {
    if (!isValidInstructorId) return;
    fetchInstructorDetail(id);
    fetchInstructorCoursesBySemester(id);
  };

  const showLoading =
    isLoadingDetail ||
    (isValidInstructorId && !instructorDetail && !detailError);
  const error = detailError ?? coursesError;

  return (
    <div
      className="min-h-screen overflow-x-hidden bg-[#f7f8fc] text-slate-900"
      dir="rtl"
    >
      <Header />

      <main className="mx-auto max-w-7xl px-4 pb-10 pt-24 sm:px-6 sm:pb-12 sm:pt-28 lg:px-8">
        <div className="mb-5">
          <Link
            to="/instructors"
            className="inline-flex min-h-10 items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-white hover:text-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700"
          >
            <ArrowRight className="h-4 w-4" />
            بازگشت به فهرست استادان
          </Link>
        </div>

        {showLoading ? (
          <section
            aria-label="در حال بارگذاری اطلاعات استاد"
            className="animate-pulse overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8"
          >
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-slate-200 sm:h-20 sm:w-20" />
              <div className="flex-1">
                <div className="h-8 w-2/3 rounded bg-slate-200" />
                <div className="mt-3 h-4 w-1/3 rounded bg-slate-100" />
              </div>
            </div>
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {Array.from({ length: 4 }, (_, index) => (
                <div key={index} className="h-20 rounded-2xl bg-slate-100" />
              ))}
            </div>
          </section>
        ) : !isValidInstructorId || (!instructorDetail && detailError) ? (
          <section
            role={error ? "alert" : undefined}
            className="rounded-3xl border border-slate-200 bg-white px-5 py-12 text-center shadow-sm sm:py-16"
          >
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">
              <AlertCircle className="h-8 w-8" />
            </span>
            <h1 className="mt-5 text-xl font-extrabold text-slate-900 sm:text-2xl">
              {isValidInstructorId
                ? "اطلاعات استاد در دسترس نیست"
                : "شناسهٔ استاد معتبر نیست"}
            </h1>
            <p className="mx-auto mt-2 max-w-lg break-words text-sm leading-7 text-slate-500">
              {error
                ? "در دریافت اطلاعات استاد مشکلی پیش آمد. اتصال را بررسی کنید و دوباره تلاش کنید."
                : "استاد موردنظر پیدا نشد یا شناسهٔ واردشده معتبر نیست."}
            </p>
            {error && (
              <p className="mx-auto mt-2 max-w-lg break-words text-xs text-rose-600">
                {error}
              </p>
            )}
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              {isValidInstructorId && (
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
                to="/instructors"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700"
              >
                <ArrowRight className="h-4 w-4" />
                بازگشت به فهرست استادان
              </Link>
            </div>
          </section>
        ) : (
          <>
            {error && (
              <div
                role="alert"
                className="mb-5 flex flex-col gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-800 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-start gap-3">
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                  <div>
                    <p className="font-bold">
                      بخشی از اطلاعات استاد دریافت نشد
                    </p>
                    <p className="mt-1 break-words text-xs text-rose-600">
                      {error}
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

            <section className="relative overflow-hidden rounded-3xl border border-indigo-100 bg-white shadow-[0_12px_40px_rgba(35,42,87,0.07)]">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-l from-indigo-700 via-violet-500 to-sky-400" />
              <div className="flex flex-col gap-6 p-5 sm:p-8 lg:flex-row lg:items-center lg:justify-between lg:p-9">
                <div className="flex min-w-0 items-center gap-4 sm:gap-5">
                  <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700 sm:h-20 sm:w-20">
                    <GraduationCap className="h-9 w-9 sm:h-11 sm:w-11" />
                  </span>
                  <div className="min-w-0">
                    <span className="mb-2 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700">
                      <Sparkles className="h-3.5 w-3.5" />
                      پروفایل آموزشی
                    </span>
                    <h1 className="break-words text-2xl font-extrabold leading-relaxed text-slate-900 sm:text-3xl lg:text-4xl">
                      {instructorDetail?.name || "استاد"}
                    </h1>
                    <p className="mt-1 flex items-center gap-2 text-sm text-slate-600 sm:text-base">
                      <Building2 className="h-4 w-4 shrink-0 text-slate-400" />
                      {instructorDetail?.field || "دپارتمان ثبت نشده"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:flex sm:gap-4">
                  <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-3 py-3 sm:min-w-36 sm:px-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                      <BookOpen className="h-5 w-5" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs text-slate-500">درس‌ها</p>
                      <p className="mt-1 truncate text-lg font-extrabold text-slate-900">
                        {instructorCoursesBySemester.reduce(
                          (total, semester) => total + semester.courses.length,
                          0,
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-3 py-3 sm:min-w-36 sm:px-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
                      <CalendarDays className="h-5 w-5" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs text-slate-500">نیمسال‌ها</p>
                      <p className="mt-1 truncate text-lg font-extrabold text-slate-900">
                        {instructorCoursesBySemester.length}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <div className="mt-6 grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,1fr)_20rem]">
              <div className="min-w-0 space-y-5">
                <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                  <div className="mb-5 flex items-center gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700">
                      <UserRound className="h-6 w-6" />
                    </span>
                    <div>
                      <h2 className="text-lg font-extrabold text-slate-900 sm:text-xl">
                        راه‌های ارتباطی
                      </h2>
                      <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                        اطلاعات تماس و محل مراجعه
                      </p>
                    </div>
                  </div>

                  <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-700">
                        <Mail className="h-5 w-5" />
                      </span>
                      <div className="min-w-0">
                        <dt className="text-xs text-slate-500">ایمیل</dt>
                        {instructorDetail?.email ? (
                          <dd className="mt-1 truncate text-sm font-bold text-slate-900">
                            <a
                              href={`mailto:${instructorDetail.email}`}
                              className="text-indigo-700 hover:underline"
                            >
                              {instructorDetail.email}
                            </a>
                          </dd>
                        ) : (
                          <dd className="mt-1 text-sm font-bold text-slate-400">
                            ثبت نشده
                          </dd>
                        )}
                      </div>
                    </div>

                    <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                        <MapPin className="h-5 w-5" />
                      </span>
                      <div className="min-w-0">
                        <dt className="text-xs text-slate-500">محل دفتر</dt>
                        <dd className="mt-1 break-words text-sm font-bold text-slate-900">
                          {instructorDetail?.office_location || "ثبت نشده"}
                        </dd>
                      </div>
                    </div>

                    <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4 sm:col-span-2">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                        <Clock3 className="h-5 w-5" />
                      </span>
                      <div className="min-w-0">
                        <dt className="text-xs text-slate-500">ساعات مراجعه</dt>
                        <dd className="mt-1 break-words text-sm font-bold leading-6 text-slate-900">
                          {instructorDetail?.office_hours || "ثبت نشده"}
                        </dd>
                      </div>
                    </div>
                  </dl>
                </section>

                <WeeklyTableView />

                <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                  <div className="mb-5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                        <BookOpen className="h-6 w-6" />
                      </span>
                      <div>
                        <h2 className="text-lg font-extrabold text-slate-900 sm:text-xl">
                          درس‌های ارائه‌شده
                        </h2>
                        <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                          درس‌ها به تفکیک نیمسال تحصیلی
                        </p>
                      </div>
                    </div>
                    <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800">
                      {instructorCoursesBySemester.reduce(
                        (total, semester) => total + semester.courses.length,
                        0,
                      )}{" "}
                      درس
                    </span>
                  </div>

                  {instructorCoursesBySemester.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center">
                      {isLoadingCourses ? (
                        <p className="text-sm text-slate-500">
                          در حال دریافت فهرست درس‌ها...
                        </p>
                      ) : (
                        <p className="text-sm leading-7 text-slate-500">
                          درسی برای این استاد در نیمسال‌های اخیر پیدا نشد.
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {instructorCoursesBySemester.map((semesterData) => (
                        <section
                          key={semesterData.semester.id}
                          className="rounded-2xl border border-slate-100 bg-slate-50 p-4 sm:p-5"
                        >
                          <div className="mb-4 flex items-center justify-between gap-3">
                            <h3 className="flex min-w-0 items-center gap-2 text-sm font-extrabold text-slate-800 sm:text-base">
                              <CalendarDays className="h-4 w-4 shrink-0 text-violet-600" />
                              <span className="truncate">
                                {semesterData.semester.name || "نیمسال"}
                              </span>
                            </h3>
                            <span className="shrink-0 rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-500">
                              {semesterData.courses.length} درس
                            </span>
                          </div>
                          {semesterData.courses.length === 0 ? (
                            <p className="text-sm text-slate-500">
                              درسی در این نیمسال ارائه نشده است.
                            </p>
                          ) : (
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                              {semesterData.courses.map((course) => (
                                <Link
                                  key={course.id}
                                  to={`/courses/${course.id}`}
                                  className="group flex min-h-14 min-w-0 items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-800 transition hover:border-indigo-200 hover:text-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700"
                                >
                                  <span className="truncate">
                                    {course.name || "درس"}
                                  </span>
                                  <ArrowRight className="h-4 w-4 shrink-0 rotate-180 text-slate-400 transition group-hover:text-indigo-600" />
                                </Link>
                              ))}
                            </div>
                          )}
                        </section>
                      ))}
                    </div>
                  )}
                </section>
              </div>

              <aside className="min-w-0 lg:sticky lg:top-28">
                <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="mb-4 flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
                      <Building2 className="h-5 w-5" />
                    </span>
                    <h2 className="text-lg font-extrabold text-slate-900">
                      دپارتمان
                    </h2>
                  </div>
                  <p className="text-sm leading-7 text-slate-600">
                    {instructorDetail?.field || "دپارتمان ثبت نشده است."}
                  </p>
                </section>
              </aside>
            </div>

            <section className="mt-6" aria-label="نظرات دانشجویان">
              <CommentSection
                instructorId={id}
                instructorName={instructorDetail?.name}
              />
            </section>
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

export default InstructorDetailPage;
