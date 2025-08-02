"use client"

import type React from "react"
import { useEffect, useState, useRef } from "react"
import { useDepartmentStore } from "../store/useScheduleStore"
import { useCourseStore } from "../store/useScheduleCourseStore"
import DepartmentList from "../components/Schedule/DepartmentList"
import WeeklyTable from "../components/Schedule/WeeklyTable"
import CourseModal from "../components/Schedule/CourseModal"
import ScheduledCourseSummary from "../components/Schedule/ScheduledCourseSummary"
import CourseList from "../components/Schedule/CourseList"
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
  const [isScheduledCourseInModal, setIsScheduledCourseInModal] = useState(false)

  // Create a ref for the WeeklyTable component
  const weeklyTableRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchDepartments()
    fetchCourses()
  }, [fetchCourses, fetchDepartments])

  const filteredCourses = selectedDept ? getCoursesByDepartment(selectedDept) : []

  const handleCourseClick = (course: CourseResponse) => {
    setSelectedCourse(course)
    setIsScheduledCourseInModal(scheduledCourses.some((c) => c.course.id === course.course.id))
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedCourse(null)
    setIsScheduledCourseInModal(false)
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
    closeModal()
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-8 flex items-center justify-between">
          {/* Back button */}
          <a
            href="/"
            className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium"
          >
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            بازگشت
          </a>

          {/* Title */}
          <div className="text-center flex-1">
            <h1 className="text-3xl font-bold text-gray-900">برنامه هفتگی دانشجو</h1>
            <p className="text-gray-600 mt-3 text-lg">دپارتمان و درس مورد نظر خود را انتخاب کنید</p>
          </div>

          <div className="flex items-center gap-2 justify-end min-w-fit">
            {/* The PDF export button is now inside WeeklyTable */}
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

        {/* Schedule and Summary */}
        <div id="schedule-container" className="flex flex-col lg:flex-row gap-8 items-stretch min-h-[600px]">
          {/* Summary (Left Column) */}
          <div className="lg:w-1/4 flex-shrink-0">
            <div className="sticky top-6">
              <ScheduledCourseSummary scheduledCourses={scheduledCourses} onCourseClick={handleCourseClick} />
            </div>
          </div>

          {/* Weekly Table (Right Column) */}
          <div className="lg:w-3/4 flex-grow">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden h-full">
              <WeeklyTable
                ref={weeklyTableRef} // Pass the ref here
                days={days}
                timeSlots={timeSlots}
                table={table}
                scheduledCourses={scheduledCourses}
                onRemoveCourse={handleRemoveCourse}
              />
            </div>
          </div>
        </div>

        {/* Course List */}
        {selectedDept && (
          <div className="mt-8">
            <CourseList courses={filteredCourses} onCourseClick={handleCourseClick} isLoading={courseLoading} />
          </div>
        )}
      </div>

      {/* Course Modal */}
      <CourseModal
        isOpen={isModalOpen}
        onClose={closeModal}
        course={selectedCourse}
        onAddToSchedule={handleAddToSchedule}
        onRemoveFromSchedule={handleRemoveCourse}
        isScheduledCourse={isScheduledCourseInModal}
      />

      <Toaster />
    </div>
  )
}

export default WeeklySchedulePage
