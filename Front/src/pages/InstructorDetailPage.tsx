"use client"

import type React from "react"
import { useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { useInstructorDetailStore } from "../store/instructors/useInstructorDetailStore"
import { BookOpen, CalendarDays, UserRound, Mail, MapPin, Clock, Building2 } from "lucide-react"

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8" dir="rtl">
        <div className="animate-pulse bg-white rounded-xl shadow-lg p-10 w-full max-w-3xl">
          <div className="h-10 bg-gray-200 rounded w-3/4 mx-auto mb-6"></div>
          <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto mb-8"></div>

          <div className="mt-10">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
          <div className="mt-10">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-10 flex items-center justify-between">
          <div className="text-center flex-1">
            <h1 className="text-4xl font-bold text-gray-900">جزئیات استاد</h1>
            <p className="text-gray-600 mt-3 text-xl">
              اطلاعات مربوط به استاد {instructorDetail ? instructorDetail.name : "نامشخص"}
            </p>
          </div>

          <Link
            to="/instructors"
            className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium"
          >
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            بازگشت به لیست اساتید
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-8" role="alert">
            <strong className="font-bold">خطا:</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg p-10 mb-8">
          <h3 className="text-3xl font-bold text-gray-900 mb-6 text-center flex items-center justify-center">
            <BookOpen className="w-8 h-8 text-emerald-600 ml-3" />
            دروس ارائه شده
          </h3>

          {instructorCoursesBySemester.length === 0 ? (
            <div className="text-center py-8 text-gray-500 text-lg">
              <p>هیچ درسی برای این استاد در ترم‌های اخیر یافت نشد.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {instructorCoursesBySemester.map((semesterData) => (
                <div key={semesterData.semester.id} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                  <h4 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <CalendarDays className="w-6 h-6 text-purple-600 ml-2" />
                    ترم: {semesterData.semester.name}
                  </h4>
                  {semesterData.courses.length === 0 ? (
                    <p className="text-gray-500 text-base pr-8">هیچ درسی در این ترم ارائه نشده است.</p>
                  ) : (
                    <ul className="list-disc list-inside space-y-2 pr-8">
                      {semesterData.courses.map((course) => (
                        <li key={course.id} className="text-gray-700 text-base">
                          <Link
                            to={`/courses/${course.id}`}
                            className="text-blue-600 hover:underline hover:text-blue-800 transition-colors"
                          >
                            {course.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-lg p-10">
          <h3 className="text-3xl font-bold text-gray-900 mb-6 text-center flex items-center justify-center">
            <UserRound className="w-8 h-8 text-blue-600 ml-3" />
            اطلاعات تماس
          </h3>
          {instructorDetail ? (
            <div className="space-y-4 text-lg text-gray-700 text-center">
              <p className="flex items-center justify-center">
                <Mail className="w-6 h-6 text-gray-500 ml-2" />
                <strong>ایمیل:</strong> {instructorDetail.email}
              </p>
              <p className="flex items-center justify-center">
                <MapPin className="w-6 h-6 text-gray-500 ml-2" />
                <strong>محل دفتر:</strong> {instructorDetail.office_location}
              </p>
              <p className="flex items-center justify-center">
                <Clock className="w-6 h-6 text-gray-500 ml-2" />
                <strong>ساعات کاری:</strong> {instructorDetail.office_hours}
              </p>
              <p className="flex items-center justify-center">
                <Building2 className="w-6 h-6 text-gray-500 ml-2" />
                <strong>دپارتمان‌ها:</strong>{" "}
                {instructorDetail.departments.map((dept) => (
                  <Link
                    key={dept.id}
                    to={`/departments?deptId=${dept.id}`}
                    className="text-green-600 hover:underline hover:text-green-800 transition-colors mr-1"
                  >
                    {dept.name}
                  </Link>
                ))}
              </p>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 text-lg">
              <p>جزئیات تماس استاد در دسترس نیست.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default InstructorDetailPage
