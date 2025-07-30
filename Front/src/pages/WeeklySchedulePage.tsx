"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useDepartmentStore } from "../store/useScheduleStore"
import { useCourseStore } from "../store/useScheduleCourseStore"
import DepartmentList from "../components/Schedule/DepartmentList"
import WeeklyTable from "../components/Schedule/WeeklyTable"
import CourseModal from "../components/Schedule/CourseModal"
import ScheduledCourseSummary from "../components/Schedule/ScheduledCourseSummary"
import CourseList from "../components/Schedule/CourseList" // Ensure CourseList is imported
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
    setIsModalOpen(false) // Corrected variable name
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
            <div className="sticky top-6">
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
          <div className="mt-8">
            <CourseList
              courses={filteredCourses}
              onCourseClick={handleCourseClick}
              isLoading={courseLoading} // Pass the isLoading prop
            />
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
