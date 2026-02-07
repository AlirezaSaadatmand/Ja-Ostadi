import type React from "react"
import { useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { useCourseDetailStore } from "../store/courses/useCourseDetailStore"
import { BookOpen, CalendarDays, Clock, Building2, UserRound, ArrowRight } from "lucide-react"

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-8" dir="rtl">
        <div className="animate-pulse bg-white rounded-xl shadow-lg p-6 sm:p-10 w-full max-w-3xl">
          <div className="h-8 sm:h-10 bg-gray-200 rounded w-3/4 mx-auto mb-4 sm:mb-6"></div>
          <div className="h-4 sm:h-6 bg-gray-200 rounded w-1/2 mx-auto mb-6 sm:mb-8"></div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-6 sm:mt-10">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-12 sm:h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="mt-6 sm:mt-8 h-20 sm:h-24 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (error || !courseDetail) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-8" dir="rtl">
        <div className="text-center py-8 sm:py-12 text-red-600">
          <p className="text-base sm:text-lg mb-4">خطا در بارگذاری جزئیات درس یا درس یافت نشد: {error}</p>
          <Link
            to="/courses"
            className="hidden sm:inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium text-sm sm:text-base"
          >
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-10">
          <div className="flex items-center justify-between mb-4 sm:mb-0">
            <Link
              to="/courses"
              className="hidden sm:inline-flex items-center px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium text-sm sm:text-base"
            >
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
              <span className="hidden sm:inline">بازگشت به لیست دروس</span>
              <span className="sm:hidden">بازگشت</span>
            </Link>
          </div>
          <div className="text-center">
            <h1 className="text-2xl sm:text-4xl font-bold text-gray-900">جزئیات درس</h1>
            <p className="text-gray-600 mt-2 sm:mt-3 text-base sm:text-xl">اطلاعات مربوط به درس {Course.name}</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-10 mb-6 sm:mb-8">
          <h3 className="text-xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 text-center flex items-center justify-center">
            <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-600 ml-2 sm:ml-3" />
            <span className="text-balance">{Course.name}</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6 text-sm sm:text-lg text-gray-700">
            <div className="flex items-center bg-gray-50 p-3 sm:p-4 rounded-lg shadow-sm">
              <span className="font-semibold ml-2">کد درس:</span>
              <span>{Course.number}</span>
            </div>
            <div className="flex items-center bg-gray-50 p-3 sm:p-4 rounded-lg shadow-sm">
              <span className="font-semibold ml-2">گروه:</span>
              <span>{Course.group}</span>
            </div>
            <div className="flex items-center bg-gray-50 p-3 sm:p-4 rounded-lg shadow-sm">
              <span className="font-semibold ml-2">واحد:</span>
              <span>{Course.units}</span>
            </div>
            <div className="flex items-center bg-gray-50 p-3 sm:p-4 rounded-lg shadow-sm">
              <span className="font-semibold ml-2">نوع کلاس:</span>
              <span>{Course.class_type}</span>
            </div>
            <div className="flex items-center bg-gray-50 p-3 sm:p-4 rounded-lg shadow-sm">
              <span className="font-semibold ml-2">ظرفیت:</span>
              <span>{Course.capacity}</span>
            </div>
            <div className="flex items-center bg-gray-50 p-3 sm:p-4 rounded-lg shadow-sm">
              <span className="font-semibold ml-2">تعداد دانشجو:</span>
              <span>{Course.student_count}</span>
            </div>
          </div>

          <div className="mt-6 sm:mt-8 space-y-3 sm:space-y-6">
            <div className="flex items-center text-sm sm:text-lg text-gray-700 bg-gray-50 p-3 sm:p-4 rounded-lg shadow-sm">
              <UserRound className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 ml-2 flex-shrink-0" />
              <span className="font-semibold ml-2">استاد:</span>
              {Instructor.name ? (
                <Link
                  to={`/instructors/${Instructor.id}`}
                  className="text-blue-600 hover:underline hover:text-blue-800 transition-colors truncate"
                >
                  {Instructor.name} ({Instructor.field})
                </Link>
              ) : null}
            </div>
            <div className="flex items-center text-sm sm:text-lg text-gray-700 bg-gray-50 p-3 sm:p-4 rounded-lg shadow-sm">
              <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 ml-2 flex-shrink-0" />
              <span className="font-semibold ml-2">دپارتمان:</span>
              <Link
                to={`/departments?deptId=${Department.id}`}
                className="text-green-600 hover:underline hover:text-green-800 transition-colors truncate"
              >
                {Department.name}
              </Link>
            </div>
            <div className="flex items-center text-sm sm:text-lg text-gray-700 bg-gray-50 p-3 sm:p-4 rounded-lg shadow-sm">
              <CalendarDays className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 ml-2 flex-shrink-0" />
              <span className="font-semibold ml-2">ترم:</span>
              <span>{Semeter.name}</span>
            </div>
          </div>

          <div className="mt-6 sm:mt-8">
            <h4 className="text-lg sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center">
              <Clock className="w-5 h-5 sm:w-7 sm:h-7 text-orange-600 ml-2" />
              زمان‌های کلاس
            </h4>
            {ClassTime.length === 0 ? (
              <p className="text-gray-500 text-sm sm:text-base pr-6 sm:pr-8">هیچ زمان کلاسی ثبت نشده است.</p>
            ) : (
              <div className="space-y-2 sm:space-y-3">
                {ClassTime.map((time, index) => (
                  <div key={index} className="bg-gray-50 p-3 sm:p-4 rounded-lg shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
                      <div className="flex items-center space-x-2 sm:space-x-4 space-x-reverse">
                        <span className="font-semibold text-gray-900 text-sm sm:text-base">{time.day}</span>  
                        <span className="text-gray-700 text-sm sm:text-base px-5">
                          {time.start_time} - {time.end_time}
                        </span>
                      </div>
                      <span className="bg-indigo-100 text-indigo-800 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm self-start sm:self-auto">
                        اتاق: {time.room}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6 sm:mt-8 space-y-3 sm:space-y-4">
            <div className="flex items-center text-sm sm:text-lg text-gray-700 bg-gray-50 p-3 sm:p-4 rounded-lg shadow-sm">
              <CalendarDays className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 ml-2 flex-shrink-0" />
              <span className="font-semibold ml-2">تاریخ امتحان پایان‌ترم:</span>
              <span className="text-balance">{Course.final_exam_date}</span>
            </div>
            <div className="flex items-center text-sm sm:text-lg text-gray-700 bg-gray-50 p-3 sm:p-4 rounded-lg shadow-sm">
              <CalendarDays className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 ml-2 flex-shrink-0" />
              <span className="font-semibold ml-2">زمان امتحان پایان‌ترم:</span>
              <span className="text-balance">{Course.final_exam_time}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseDetailPage
