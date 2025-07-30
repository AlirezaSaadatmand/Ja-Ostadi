"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useDepartmentStore } from "../store/useScheduleStore"
import { useCourseStore } from "../store/useScheduleCourseStore"
import DepartmentList from "../components/Schedule/DepartmentList"
import WeeklyTable from "../components/Schedule/WeeklyTable"
import CourseModal from "../components/Schedule/CourseModal"
import ScheduledCourseSummary from "../components/Schedule/ScheduledCourseSummary"
import type { CourseResponse } from "../types"
import { useScheduleTableStore, days, timeSlots } from "../store/useScheduleTableStore"
import toast, { Toaster } from "react-hot-toast"

const WeeklySchedulePage: React.FC = () => {
  const { departments, isLoading: depLoading, fetchDepartments } = useDepartmentStore()
  const { isLoading: courseLoading, fetchCourses, getCoursesByDepartment } = useCourseStore()
  const scheduledCourses = useScheduleTableStore((state) => state.scheduledCourses)
  const addCourseToSchedule = useScheduleTableStore((state) => state.addCourseToSchedule)
  const removeCourseFromSchedule = useScheduleTableStore((state) => state.removeCourseFromSchedule)
  const table = useScheduleTableStore((state) => state.table)

  const [selectedDept, setSelectedDept] = useState<number | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState<CourseResponse | null>(null)

  useEffect(() => {
    fetchDepartments()
    fetchCourses()
  }, [fetchCourses, fetchDepartments])

  const filteredCourses = selectedDept ? getCoursesByDepartment(selectedDept) : []

  const handleCourseClick = (course: CourseResponse) => {
    setSelectedCourse(course)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedCourse(null)
  }

  const handleAddToSchedule = (course: CourseResponse) => {
    const success = addCourseToSchedule(course)
    if (!success) {
      toast.error("این درس با برنامه فعلی شما تداخل دارد و اضافه نشد.")
    } else {
      toast.success(`درس "${course.course.name}" با موفقیت به برنامه اضافه شد.`)
    }
    closeModal()
  }

  const handleRemoveCourse = (courseId: number) => {
    const courseName = scheduledCourses.find((c) => c.course.id === courseId)?.course.name || "درس"
    removeCourseFromSchedule(courseId)
    toast.success(`${courseName} با موفقیت از برنامه حذف شد.`)
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <a
              href="/"
              className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200 font-medium"
            >
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              بازگشت
            </a>
            <div className="text-center flex-1">
              <h1 className="text-3xl font-bold text-gray-900">برنامه هفتگی دانشجو</h1>
              <p className="text-gray-600 mt-3 text-lg">دپارتمان و درس مورد نظر خود را انتخاب کنید</p>
            </div>
            <div className="w-24"></div> {/* Spacer for balance */}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Department Selection */}
        <div className="mb-8">
          <DepartmentList
            departments={Array.isArray(departments) ? departments : []}
            selectedDept={selectedDept}
            onSelect={setSelectedDept}
            isLoading={depLoading}
          />
        </div>

        {/* Main Schedule & Summary Area */}
        <div className="flex flex-col lg:flex-row gap-8 items-stretch min-h-[600px]">
          {/* Left Side Column: Summary */}
          <div className="lg:w-1/4 flex-shrink-0">
            <div className="sticky top-6 h-full">
              <ScheduledCourseSummary scheduledCourses={scheduledCourses} onCourseClick={handleCourseClick} />
            </div>
          </div>

          {/* Right Side Column: Weekly Table */}
          <div className="lg:w-3/4 flex-grow">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden h-full">
              <WeeklyTable
                days={days}
                timeSlots={timeSlots}
                table={table}
                scheduledCourses={scheduledCourses}
                onRemoveCourse={handleRemoveCourse}
              />
            </div>
          </div>
        </div>

        {/* Course List at the bottom */}
        {selectedDept && (
          <div className="mt-8 bg-white rounded-lg shadow-sm p-5">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center justify-center">
              <svg className="w-5 h-5 ml-3 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              دروس موجود ({filteredCourses.length})
            </h3>
            {courseLoading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-5 bg-gray-200 rounded w-1/2"></div>
                <div className="flex overflow-x-auto gap-4 pb-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-24 w-48 bg-gray-200 rounded flex-shrink-0"></div>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {filteredCourses.length === 0 ? (
                  <div className="p-8 text-center col-span-full">
                    <svg
                      className="w-16 h-16 text-gray-300 mx-auto mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                    <p className="text-gray-500">هیچ درسی یافت نشد</p>
                  </div>
                ) : (
                  <div className="grid grid-flow-col grid-rows-2 gap-4 pb-2 overflow-x-auto scrollbar-hide auto-cols-max">
                    {filteredCourses.map((course) => (
                      <div
                        key={course.course.id}
                        className="p-4 rounded-lg bg-gray-50 hover:bg-emerald-50 border border-gray-200 hover:border-emerald-300 transition-all duration-200 cursor-pointer"
                        onClick={() => handleCourseClick(course)}
                      >
                        <div className="flex items-center justify-between">
                          {/* Course Name and Instructor (will be on the right in RTL) */}
                          <div className="flex-1 text-right ml-2">
                            <span className="font-medium text-gray-800 block">{course.course.name}</span>
                            <span className="text-xs text-gray-500 block mt-1">استاد: {course.instructor.name}</span>
                          </div>
                          {/* Units (will be on the left in RTL) */}
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded flex-shrink-0">
                            {course.course.units} واحد
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
      {/* Course Modal */}
      <CourseModal
        isOpen={isModalOpen}
        onClose={closeModal}
        course={selectedCourse}
        onAddToSchedule={handleAddToSchedule}
      />
      <Toaster />
    </div>
  )
}

export default WeeklySchedulePage
