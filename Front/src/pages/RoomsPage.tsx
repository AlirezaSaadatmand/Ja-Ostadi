import type React from "react";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  AlertCircle,
  Building2,
  CalendarDays,
  Clock3,
  Download,
  FileSpreadsheet,
  GraduationCap,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import Header from "../components/Header";
import RoomWeeklyTableView from "../components/Room/RoomWeeklyTableView";
import { downloadRoomScheduleExcel } from "../components/Room/DownloadRoomScheduleExcel";
import { useRoomPdfExportStore } from "../store/usefull/useRoomPdfExportStore";
import { useRoomStore } from "../store/usefull/useRoomScheduleStore";
import config from "../config/config";
import type { RoomItem } from "../types";

const RoomsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    rooms,
    roomSchedule,
    isLoading,
    error,
    fetchRooms,
    fetchRoomSchedule,
  } = useRoomStore();
  const selectedRoomId = searchParams.get("roomId");
  const selectedRoom = rooms.find(
    (room) => room.id.toString() === selectedRoomId,
  );
  const isExportingPdf = useRoomPdfExportStore((state) => state.isExporting);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  useEffect(() => {
    if (
      rooms.length > 0 &&
      !rooms.some((room) => room.id.toString() === selectedRoomId)
    ) {
      setSearchParams({ roomId: rooms[0].id.toString() }, { replace: true });
    }
  }, [rooms, selectedRoomId, setSearchParams]);

  useEffect(() => {
    if (selectedRoomId) {
      fetchRoomSchedule(selectedRoomId);
    }
  }, [selectedRoomId, fetchRoomSchedule]);

  const handleRoomChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newRoomId = event.target.value;
    if (newRoomId) {
      setSearchParams({ roomId: newRoomId });
    }
  };

  const handleRetry = () => {
    fetchRooms();
    if (selectedRoomId) {
      fetchRoomSchedule(selectedRoomId);
    }
  };

  const handlePdfExport = () => {
    void useRoomPdfExportStore.getState().exportRoomPdf(roomSchedule);
  };

  const classSessions = roomSchedule.reduce(
    (total, course) => total + course.time.length,
    0,
  );

  const renderRoomOption = (room: RoomItem) => (
    <option key={room.id} value={room.id}>
      {room.room}
    </option>
  );

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
                مدیریت فضاهای آموزشی
              </span>
              <h1 className="text-2xl font-extrabold leading-relaxed text-slate-900 sm:text-3xl lg:text-4xl">
                برنامهٔ کلاس‌ها
              </h1>
              <p className="mt-2 text-sm leading-7 text-slate-600 sm:text-base">
                زمان‌بندی درس‌ها را بر اساس کلاس انتخابی بررسی کنید.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:flex sm:gap-4">
              <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-3 py-3 sm:min-w-40 sm:px-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700">
                  <Building2 className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs text-slate-500">کلاس انتخاب‌شده</p>
                  <p className="mt-1 truncate text-sm font-extrabold text-slate-900">
                    {selectedRoom?.room || "—"}
                  </p>
                </div>
              </div>
              <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-3 py-3 sm:min-w-40 sm:px-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                  <CalendarDays className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs text-slate-500">جلسه‌های هفتگی</p>
                  <p className="mt-1 truncate text-lg font-extrabold text-slate-900">
                    {isLoading ? "…" : classSessions}
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
                انتخاب کلاس
              </h2>
              <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                یک کلاس را انتخاب کنید تا برنامهٔ هفتگی آن نمایش داده شود.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 items-end gap-4 sm:grid-cols-[minmax(0,1fr)_auto]">
            <div>
              <label
                htmlFor="room-select"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                کلاس یا فضای آموزشی
              </label>
              <div className="relative">
                <Building2 className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <select
                  id="room-select"
                  className="min-h-12 w-full appearance-none rounded-xl border border-slate-200 bg-white py-3 pr-10 pl-4 text-sm text-slate-800 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                  value={selectedRoomId ?? ""}
                  onChange={handleRoomChange}
                  disabled={rooms.length === 0 || isLoading}
                >
                  {rooms.length === 0 ? (
                    <option value="">
                      {isLoading
                        ? "در حال دریافت فهرست کلاس‌ها..."
                        : "کلاسی در دسترس نیست"}
                    </option>
                  ) : (
                    rooms.map(renderRoomOption)
                  )}
                </select>
              </div>
            </div>

            <p className="text-sm font-bold text-indigo-700 sm:pb-3">
              {rooms.length} کلاس در دسترس
            </p>
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
                <p className="font-bold">
                  دریافت برنامهٔ کلاس‌ها با مشکل روبه‌رو شد
                </p>
                <p className="mt-1 text-sm leading-6 text-rose-700">
                  اتصال به سرویس برقرار نشد. دوباره تلاش کنید.
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

        {isLoading && (
          <section
            aria-label="در حال بارگذاری برنامه"
            className="mt-6 animate-pulse overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
          >
            <div className="h-6 w-40 rounded bg-slate-200" />
            <div className="mt-5 h-72 rounded-2xl bg-slate-100" />
          </section>
        )}

        {!isLoading && !error && !selectedRoom && rooms.length === 0 && (
          <section className="mt-6 rounded-3xl border border-slate-200 bg-white px-5 py-12 text-center shadow-sm sm:py-16">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-400">
              <Building2 className="h-8 w-8" />
            </span>
            <h2 className="mt-5 text-lg font-extrabold text-slate-900">
              کلاسی برای نمایش پیدا نشد
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-slate-500">
              در حال حاضر فهرست کلاس‌ها در دسترس نیست. کمی بعد دوباره بررسی
              کنید.
            </p>
            <button
              type="button"
              onClick={handleRetry}
              className="mt-5 inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-indigo-200 px-4 py-2 text-sm font-bold text-indigo-700 transition hover:bg-indigo-50"
            >
              <RefreshCw className="h-4 w-4" />
              دریافت دوباره
            </button>
          </section>
        )}

        {!isLoading && !error && selectedRoom && roomSchedule.length === 0 && (
          <section className="mt-6 rounded-3xl border border-slate-200 bg-white px-5 py-12 text-center shadow-sm sm:py-16">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-400">
              <CalendarDays className="h-8 w-8" />
            </span>
            <h2 className="mt-5 text-lg font-extrabold text-slate-900">
              برنامه‌ای برای این کلاس ثبت نشده است
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-slate-500">
              برای کلاس {selectedRoom.room} هنوز جلسه‌ای در برنامهٔ هفتگی ثبت
              نشده است.
            </p>
          </section>
        )}

        {!isLoading && !error && roomSchedule.length > 0 && (
          <section className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col gap-4 border-b border-slate-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div className="min-w-0">
                <p className="text-sm font-bold text-emerald-700">
                  برنامهٔ هفتگی
                </p>
                <h2 className="mt-1 truncate text-xl font-extrabold text-slate-900">
                  {selectedRoom?.room || "کلاس انتخاب‌شده"}
                </h2>
                <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-slate-500">
                  <Clock3 className="h-3.5 w-3.5" />
                  {classSessions} جلسه در هفته
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:flex sm:shrink-0">
                <button
                  type="button"
                  onClick={() => void downloadRoomScheduleExcel(roomSchedule)}
                  className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-white px-3 py-2 text-sm font-bold text-emerald-800 transition hover:bg-emerald-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 sm:px-4"
                >
                  <FileSpreadsheet className="h-4 w-4" />
                  دریافت Excel
                </button>
                <button
                  type="button"
                  onClick={handlePdfExport}
                  disabled={isExportingPdf}
                  className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-indigo-700 px-3 py-2 text-sm font-bold text-white transition hover:bg-indigo-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 sm:px-4"
                >
                  <Download className="h-4 w-4" />
                  {isExportingPdf ? "در حال آماده‌سازی..." : "دریافت PDF"}
                </button>
              </div>
            </div>

            <RoomWeeklyTableView roomSchedule={roomSchedule} />
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

export default RoomsPage;
