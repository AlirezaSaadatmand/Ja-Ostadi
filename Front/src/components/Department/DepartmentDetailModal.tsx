import type React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  Building2,
  GraduationCap,
  Users,
  X,
} from "lucide-react";
import type { DepartmentDetail } from "../../types";

interface DepartmentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  department: DepartmentDetail | null;
}

const DepartmentDetailModal: React.FC<DepartmentDetailModalProps> = ({
  isOpen,
  onClose,
  department,
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !department) return null;

  const handleViewCourses = () => {
    navigate(`/courses?deptId=${department.id}`);
    onClose();
  };

  const handleViewInstructors = () => {
    navigate(`/instructors?deptId=${department.id}&mode=department`);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/45 p-4 backdrop-blur-sm"
      dir="rtl"
      onClick={onClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="department-dialog-title"
        className="relative my-auto w-full max-w-lg overflow-hidden rounded-3xl border border-white/60 bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-l from-indigo-700 via-violet-500 to-emerald-400" />
        <button
          type="button"
          onClick={onClose}
          aria-label="بستن جزئیات دپارتمان"
          className="absolute left-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="bg-gradient-to-bl from-indigo-50 via-white to-white px-5 pb-6 pt-8 sm:px-8 sm:pt-10">
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700 shadow-sm">
            <Building2 className="h-8 w-8" />
          </span>
          <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-bold text-indigo-700 shadow-sm">
            <GraduationCap className="h-4 w-4" />
            اطلاعات دپارتمان
          </p>
          <h2
            id="department-dialog-title"
            className="mt-2 break-words pl-10 text-2xl font-extrabold leading-relaxed text-slate-900 sm:text-3xl"
          >
            {department.name}
          </h2>
        </div>

        <div className="px-5 pb-6 sm:px-8">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-700">
                <Users className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-xl font-extrabold text-slate-900">
                  {department.instructors_count}
                </p>
                <p className="mt-0.5 text-xs text-slate-600">استاد</p>
              </div>
            </div>
            <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-violet-100 bg-violet-50/70 p-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-violet-700">
                <BookOpen className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-xl font-extrabold text-slate-900">
                  {department.courses_count}
                </p>
                <p className="mt-0.5 text-xs text-slate-600">درس</p>
              </div>
            </div>
          </div>

          <p className="mt-5 text-sm leading-7 text-slate-500">
            برای مشاهدهٔ فهرست درس‌ها یا استادان این دپارتمان، یکی از گزینه‌های
            زیر را انتخاب کنید.
          </p>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={handleViewCourses}
              className="inline-flex min-h-12 items-center justify-between gap-3 rounded-xl bg-indigo-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-indigo-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700"
            >
              <span className="inline-flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                مشاهدهٔ درس‌ها
              </span>
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={handleViewInstructors}
              className="inline-flex min-h-12 items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700"
            >
              <span className="inline-flex items-center gap-2">
                <Users className="h-4 w-4" />
                مشاهدهٔ استادان
              </span>
              <ArrowLeft className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DepartmentDetailModal;
