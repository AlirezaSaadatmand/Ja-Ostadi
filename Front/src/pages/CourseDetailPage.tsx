import type React from "react"
import { useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { useCourseDetailStore } from "../store/courses/useCourseDetailStore"
import { BookOpen, CalendarDays, Clock, Building2, UserRound } from "lucide-react"

const CourseDetailPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>()
  const id = Number(courseId)

  const { courseDetail, isLoading, error, fetchCourseDetail, clearCourseDetail } = useCourseDetailStore()

  useEffect(() => {
    if (id) {
      fetchCourseDetail(id)
    }
    return () => {
      clearCourseDetail()
    }
  }, [id, fetchCourseDetail, clearCourseDetail])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8" dir="rtl">
        <div className="animate-pulse bg-white rounded-xl shadow-lg p-10 w-full max-w-3xl">
          <div className="h-10 bg-gray-200 rounded w-3/4 mx-auto mb-6"></div>
          <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto mb-8"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="mt-8 h-24 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (error || !courseDetail) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8" dir="rtl">
        <div className="text-center py-12 text-red-600">
          <p className="text-lg">خطا در بارگذاری جزئیات درس یا درس یافت نشد: {error}</p>
          <Link
            to="/courses"
            className="hidden sm:inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium"
          >
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            بازگشت به لیست دروس
          </Link>
        </div>
      </div>
    )
  }

  const { Course, Instructor, Department, ClassTime, Semeter } = courseDetail

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-10 flex items-center justify-between">
          <div className="text-center flex-1">
            <h1 className="text-4xl font-bold text-gray-900">جزئیات درس</h1>
            <p className="text-gray-600 mt-3 text-xl">اطلاعات مربوط به درس {Course.name}</p>
          </div>

          <Link
            to="/courses"
            className="hidden sm:inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium"
          >
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            بازگشت به لیست دروس
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl shadow-lg p-10 mb-8">
          <h3 className="text-3xl font-bold text-gray-900 mb-6 text-center flex items-center justify-center">
            <BookOpen className="w-8 h-8 text-emerald-600 ml-3" />
            {Course.name}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-lg text-gray-700">
            <div className="flex items-center bg-gray-50 p-4 rounded-lg shadow-sm">
              <span className="font-semibold ml-2">کد درس:</span>
              <span>{Course.number}</span>
            </div>
            <div className="flex items-center bg-gray-50 p-4 rounded-lg shadow-sm">
              <span className="font-semibold ml-2">گروه:</span>
              <span>{Course.group}</span>
            </div>
            <div className="flex items-center bg-gray-50 p-4 rounded-lg shadow-sm">
              <span className="font-semibold ml-2">واحد:</span>
              <span>{Course.units}</span>
            </div>
            <div className="flex items-center bg-gray-50 p-4 rounded-lg shadow-sm">
              <span className="font-semibold ml-2">نوع کلاس:</span>
              <span>{Course.class_type}</span>
            </div>
            <div className="flex items-center bg-gray-50 p-4 rounded-lg shadow-sm">
              <span className="font-semibold ml-2">ظرفیت:</span>
              <span>{Course.capacity}</span>
            </div>
            <div className="flex items-center bg-gray-50 p-4 rounded-lg shadow-sm">
              <span className="font-semibold ml-2">تعداد دانشجو:</span>
              <span>{Course.student_count}</span>
            </div>
          </div>

          <div className="mt-8 space-y-6">
            <div className="flex items-center text-lg text-gray-700 bg-gray-50 p-4 rounded-lg shadow-sm">
              <UserRound className="w-6 h-6 text-blue-600 ml-2" />
              <span className="font-semibold ml-2">استاد:</span>
              {Instructor.name ? 
              <Link
                to={`/instructors/${Instructor.id}`}
                className="text-blue-600 hover:underline hover:text-blue-800 transition-colors"
              >
                {Instructor.name} ({Instructor.field})
              </Link> : null}
            </div>
            <div className="flex items-center text-lg text-gray-700 bg-gray-50 p-4 rounded-lg shadow-sm">
              <Building2 className="w-6 h-6 text-green-600 ml-2" />
              <span className="font-semibold ml-2">دپارتمان:</span>
              <Link
                to={`/departments?deptId=${Department.id}`}
                className="text-green-600 hover:underline hover:text-green-800 transition-colors"
              >
                {Department.name}
              </Link>
            </div>
            <div className="flex items-center text-lg text-gray-700 bg-gray-50 p-4 rounded-lg shadow-sm">
              <CalendarDays className="w-6 h-6 text-purple-600 ml-2" />
              <span className="font-semibold ml-2">ترم:</span>
              <span>{Semeter.name}</span>
            </div>
          </div>

          <div className="mt-8">
            <h4 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <Clock className="w-7 h-7 text-orange-600 ml-2" />
              زمان‌های کلاس
            </h4>
            {ClassTime.length === 0 ? (
              <p className="text-gray-500 text-base pr-8">هیچ زمان کلاسی ثبت نشده است.</p>
            ) : (
              <div className="space-y-3">
                {ClassTime.map((time, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg shadow-sm flex justify-between items-center">
                    <div className="flex items-center space-x-4 space-x-reverse">
                      <span className="font-semibold text-gray-900">{time.day}</span>
                      <span className="text-gray-700">
                        {time.start_time} - {time.end_time}
                      </span>
                    </div>
                    <span className="bg-indigo-100 text-indigo-800 px-3 py-1.5 rounded-full text-sm">
                      اتاق: {time.room}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-8 space-y-4">
            <div className="flex items-center text-lg text-gray-700 bg-gray-50 p-4 rounded-lg shadow-sm">
              <CalendarDays className="w-6 h-6 text-red-600 ml-2" />
              <span className="font-semibold ml-2">زمان امتحان میان‌ترم:</span>
              <span>{Course.mid_exam_time}</span>
            </div>
            <div className="flex items-center text-lg text-gray-700 bg-gray-50 p-4 rounded-lg shadow-sm">
              <CalendarDays className="w-6 h-6 text-red-600 ml-2" />
              <span className="font-semibold ml-2">زمان امتحان پایان‌ترم:</span>
              <span>{Course.final_exam_date}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseDetailPage