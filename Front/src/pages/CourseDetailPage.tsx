import type React from "react";
import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useCourseDetailStore } from "../store/courses/useCourseDetailStore";
import PageShell from "../components/common/PageShell";
import {
  BookOpen,
  CalendarDays,
  Clock,
  Building2,
  UserRound,
  ArrowRight,
  DoorOpen,
} from "lucide-react";

const InfoTile = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
    <p className="text-xs text-gray-500">{label}</p>
    <p className="mt-1 text-lg font-semibold text-gray-900">{value || "—"}</p>
  </div>
);

const LinkRow = ({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) => (
  <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4">
    <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-brand/15 text-brand-dark">
      {icon}
    </span>
    <div className="min-w-0">
      <p className="text-xs text-gray-500">{label}</p>
      <div className="truncate font-semibold text-gray-900">{children}</div>
    </div>
  </div>
);

const CourseDetailPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const id = Number(courseId);

  const {
    courseDetail,
    isLoading,
    error,
    fetchCourseDetail,
    clearCourseDetail,
  } = useCourseDetailStore();

  useEffect(() => {
    if (id) {
      fetchCourseDetail(id);
    }
    return () => {
      clearCourseDetail();
    };
  }, [id, fetchCourseDetail, clearCourseDetail]);

  if (isLoading) {
    return (
      <PageShell maxWidth="max-w-3xl">
        <div className="animate-pulse rounded-2xl bg-white p-6 shadow-sm sm:p-10">
          <div className="mx-auto mb-6 h-9 w-3/4 rounded bg-gray-200"></div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-16 rounded-xl bg-gray-200"></div>
            ))}
          </div>
        </div>
      </PageShell>
    );
  }

  if (error || !courseDetail) {
    return (
      <PageShell maxWidth="max-w-3xl">
        <div className="py-12 text-center">
          <p className="mb-6 text-lg text-red-600">
            خطا در بارگذاری جزئیات درس یا درس یافت نشد{error ? `: ${error}` : ""}
          </p>
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 font-semibold text-white shadow-sm transition hover:bg-brand-dark"
          >
            <ArrowRight className="h-5 w-5" />
            بازگشت به لیست دروس
          </Link>
        </div>
      </PageShell>
    );
  }

  const { Course, Instructor, Department, ClassTime, Semeter } = courseDetail;

  return (
    <PageShell maxWidth="max-w-4xl">
      <Link
        to="/courses"
        className="mb-5 inline-flex items-center gap-2 rounded-xl bg-white/80 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-white"
      >
        <ArrowRight className="h-4 w-4" />
        بازگشت به لیست دروس
      </Link>

      <div className="animate-fade-up rounded-2xl border border-white/70 bg-white/90 p-5 shadow-sm sm:p-10">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand to-brand-dark text-white shadow-md">
            <BookOpen className="h-7 w-7" />
          </span>
          <h1 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">
            {Course.name}
          </h1>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
          <InfoTile label="کد درس" value={Course.number} />
          <InfoTile label="گروه" value={Course.group} />
          <InfoTile label="واحد" value={Course.units} />
          <InfoTile label="نوع کلاس" value={Course.class_type} />
          <InfoTile label="ظرفیت" value={Course.capacity} />
          <InfoTile label="تعداد دانشجو" value={Course.student_count} />
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <LinkRow icon={<UserRound className="h-5 w-5" />} label="استاد">
            {Instructor.name ? (
              <Link
                to={`/instructors/${Instructor.id}`}
                className="text-brand-dark hover:underline"
              >
                {Instructor.name}
              </Link>
            ) : (
              "—"
            )}
          </LinkRow>
          <LinkRow icon={<Building2 className="h-5 w-5" />} label="دپارتمان">
            <Link
              to={`/departments?deptId=${Department.id}`}
              className="text-brand-dark hover:underline"
            >
              {Department.name}
            </Link>
          </LinkRow>
          <LinkRow icon={<CalendarDays className="h-5 w-5" />} label="ترم">
            {Semeter.name}
          </LinkRow>
        </div>

        <h2 className="mb-3 mt-8 flex items-center gap-2 text-xl font-bold text-gray-900">
          <Clock className="h-6 w-6 text-brand" />
          زمان‌های کلاس
        </h2>
        {ClassTime.length === 0 ? (
          <p className="text-gray-500">هیچ زمان کلاسی ثبت نشده است.</p>
        ) : (
          <div className="space-y-2">
            {ClassTime.map((time, index) => (
              <div
                key={index}
                style={{ animationDelay: `${index * 60}ms` }}
                className="flex animate-fade-up flex-col gap-2 rounded-xl border border-gray-100 bg-gray-50 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-4">
                  <span className="font-semibold text-gray-900">{time.day}</span>
                  <span className="tabular-nums text-gray-700">
                    {time.start_time} - {time.end_time}
                  </span>
                </div>
                <span className="inline-flex items-center gap-1 self-start rounded-full bg-brand/15 px-3 py-1 text-sm text-brand-dark sm:self-auto">
                  <DoorOpen className="h-4 w-4" />
                  {time.room}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <InfoTile label="تاریخ امتحان پایان‌ترم" value={Course.final_exam_date} />
          <InfoTile label="زمان امتحان پایان‌ترم" value={Course.final_exam_time} />
        </div>
      </div>
    </PageShell>
  );
};

export default CourseDetailPage;
