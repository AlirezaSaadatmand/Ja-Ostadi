import type React from "react";
import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useInstructorDetailStore } from "../store/instructors/useInstructorDetailStore";
import PageShell from "../components/common/PageShell";
import CommentSection from "../components/Instructor/CommentSection";
import WeeklyTableView from "../components/Instructor/WeeklyTableView";
import {
  BookOpen,
  CalendarDays,
  UserRound,
  Mail,
  MapPin,
  Clock,
  Building2,
  ArrowRight,
} from "lucide-react";

const InstructorDetailPage: React.FC = () => {
  const { instructorId } = useParams<{ instructorId: string }>();
  const id = Number(instructorId);

  const {
    instructorDetail,
    instructorCoursesBySemester,
    isLoading,
    error,
    fetchInstructorDetail,
    fetchInstructorCoursesBySemester,
    clearInstructorData,
  } = useInstructorDetailStore();

  useEffect(() => {
    if (id) {
      fetchInstructorDetail(id);
      fetchInstructorCoursesBySemester(id);
    }
    return () => {
      clearInstructorData();
    };
  }, [
    id,
    fetchInstructorDetail,
    fetchInstructorCoursesBySemester,
    clearInstructorData,
  ]);

  if (isLoading) {
    return (
      <PageShell maxWidth="max-w-3xl">
        <div className="animate-pulse space-y-6 rounded-2xl bg-white p-6 shadow-sm sm:p-10">
          <div className="mx-auto h-9 w-3/4 rounded bg-gray-200"></div>
          <div className="mx-auto h-5 w-1/2 rounded bg-gray-200"></div>
          <div className="h-24 rounded bg-gray-200"></div>
          <div className="h-24 rounded bg-gray-200"></div>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell
      title="اطلاعات استاد"
      subtitle={instructorDetail?.name || "—"}
      maxWidth="max-w-5xl"
    >
      <Link
        to="/instructors"
        className="mb-5 inline-flex items-center gap-2 rounded-xl bg-white/80 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-white"
      >
        <ArrowRight className="h-4 w-4" />
        بازگشت به اساتید
      </Link>

      <div className="space-y-6 sm:space-y-8">
        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-center text-sm sm:text-base"
            role="alert"
          >
            <strong className="font-bold">خطا:</strong>
            <span className="ml-1 sm:ml-2">{error}</span>
          </div>
        )}

        <div className="animate-fade-up rounded-2xl border border-white/70 bg-white/90 p-5 shadow-sm sm:p-8">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 text-center flex items-center justify-center">
            <UserRound className="w-6 sm:w-7 h-6 sm:h-7 text-blue-600 ml-2" />
            اطلاعات تماس
          </h3>
          {instructorDetail ? (
            <div className="space-y-4 sm:space-y-5 text-sm sm:text-lg text-gray-700 text-center">
              <p className="flex items-center justify-center flex-wrap gap-1">
                <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500 ml-2" />
                <strong>ایمیل:</strong> {instructorDetail.email || "—"}
              </p>
              <p className="flex items-center justify-center flex-wrap gap-1">
                <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500 ml-2" />
                <strong>محل دفتر:</strong>{" "}
                {instructorDetail.office_location || "—"}
              </p>
              <p className="flex items-center justify-center flex-wrap gap-1">
                <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500 ml-2" />
                <strong>ساعات کاری:</strong>{" "}
                {instructorDetail.office_hours || "—"}
              </p>
              <p className="flex items-center justify-center flex-wrap gap-1">
                <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500 ml-2" />
                <strong>دپارتمان‌:</strong> {instructorDetail.field || "—"}
              </p>
            </div>
          ) : (
            <p className="text-center text-gray-500 py-4 sm:py-6 text-sm sm:text-base">
              جزئیات تماس استاد در دسترس نیست.
            </p>
          )}
        </div>

        <div className="overflow-hidden rounded-2xl border border-white/70 bg-white/90 shadow-sm">
          <WeeklyTableView />
        </div>
        <div className="rounded-2xl border border-white/70 bg-white/90 p-5 shadow-sm sm:p-8">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 text-center flex items-center justify-center">
            <BookOpen className="w-6 sm:w-7 h-6 sm:h-7 text-emerald-600 ml-2" />
            دروس ارائه شده
          </h3>

          {instructorCoursesBySemester.length === 0 ? (
            <p className="text-center text-gray-500 py-4 sm:py-6 text-sm sm:text-base">
              هیچ درسی برای این استاد در ترم‌های اخیر یافت نشد.
            </p>
          ) : (
            <div className="space-y-4 sm:space-y-6">
              {instructorCoursesBySemester.map((semesterData) => (
                <div
                  key={semesterData.semester.id}
                  className="border border-gray-200 rounded-xl p-4 sm:p-6 bg-gray-50"
                >
                  <h4 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 flex items-center">
                    <CalendarDays className="w-5 h-5 text-purple-600 ml-2" />
                    ترم: {semesterData.semester.name || "—"}
                  </h4>
                  {semesterData.courses.length === 0 ? (
                    <p className="text-gray-500 pr-6 text-sm sm:text-base">
                      هیچ درسی در این ترم ارائه نشده است.
                    </p>
                  ) : (
                    <div className="flex flex-wrap gap-2 pr-6">
                      {semesterData.courses.map((course) => (
                        <Link
                          key={course.id}
                          to={`/courses/${course.id}`}
                          className="px-2.5 sm:px-3 py-1 sm:py-1.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-xs sm:text-sm font-medium"
                        >
                          {course.name || "—"}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
          <CommentSection
            instructorId={id}
            instructorName={instructorDetail?.name}
          />
      </div>
    </PageShell>
  );
};

export default InstructorDetailPage;
