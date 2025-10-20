"use client"

import type React from "react"
import { useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { useInstructorDetailStore } from "../store/instructors/useInstructorDetailStore"
import WeeklyTableView from "../components/Instructor/WeeklyTableView"
import {
  BookOpen,
  CalendarDays,
  UserRound,
  Mail,
  MapPin,
  Clock,
  Building2,
  ArrowRight,
} from "lucide-react"

const InstructorDetailPage: React.FC = () => {
  const { instructorId } = useParams<{ instructorId: string }>()
  const id = Number(instructorId)

  const {
    instructorDetail,
    instructorCoursesBySemester,
    isLoading,
    error,
    fetchInstructorDetail,
    fetchInstructorCoursesBySemester,
    clearInstructorData,
  } = useInstructorDetailStore()

  useEffect(() => {
    if (id) {
      fetchInstructorDetail(id)
      fetchInstructorCoursesBySemester(id)
    }
    return () => {
      clearInstructorData()
    }
  }, [id, fetchInstructorDetail, fetchInstructorCoursesBySemester, clearInstructorData])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-8" dir="rtl">
        <div className="animate-pulse bg-white rounded-xl shadow-lg p-6 sm:p-10 w-full max-w-3xl space-y-6">
          <div className="h-8 sm:h-10 bg-gray-200 rounded w-3/4 mx-auto"></div>
          <div className="h-5 sm:h-6 bg-gray-200 rounded w-1/2 mx-auto"></div>
          <div className="h-20 sm:h-24 bg-gray-200 rounded"></div>
          <div className="h-20 sm:h-24 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 relative">
        <Link
          to="/instructors"
          className="hidden sm:inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium absolute top-4 right-4 sm:right-6 text-sm sm:text-base"
        >
          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
          بازگشت
        </Link>

          <div className="text-center space-y-2 sm:space-y-3">
            <h1 className="text-2xl sm:text-4xl font-bold text-gray-900">جزئیات استاد</h1>
            <p className="text-gray-600 text-base sm:text-xl">
              اطلاعات مربوط به استاد{" "}
              <span className="font-semibold text-gray-800">
                {instructorDetail?.name || "—"}
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6 sm:space-y-10">
        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-center text-sm sm:text-base"
            role="alert"
          >
            <strong className="font-bold">خطا:</strong>
            <span className="ml-1 sm:ml-2">{error}</span>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-lg p-5 sm:p-8">
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
                <strong>محل دفتر:</strong> {instructorDetail.office_location || "—"}
              </p>
              <p className="flex items-center justify-center flex-wrap gap-1">
                <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500 ml-2" />
                <strong>ساعات کاری:</strong> {instructorDetail.office_hours || "—"}
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

        <div className="bg-white rounded-2xl shadow-lg">

        <WeeklyTableView />
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-5 sm:p-8">
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

      </div>
    </div>
  )
}

export default InstructorDetailPage
