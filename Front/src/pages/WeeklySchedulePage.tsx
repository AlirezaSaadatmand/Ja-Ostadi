"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useDepartmentStore } from "../store/useScheduleStore"
import { useCourseStore } from "../store/useScheduleCourseStore"
import DepartmentList from "../components/Schedule/DepartmentList"
import CourseList from "../components/Schedule/CourseList"
import WeeklyTable from "../components/Schedule/WeeklyTable"
import CourseModal from "../components/Schedule/CourseModal"
import type { CourseResponse } from "../types"
import { useScheduleTableStore, days, timeSlots } from "../store/useScheduleTableStore" // Import from Zustand store

const WeeklySchedulePage: React.FC = () => {
  const { departments, isLoading: depLoading, fetchDepartments } = useDepartmentStore()
  const { isLoading: courseLoading, fetchCourses, getCoursesByDepartment } = useCourseStore()
  // Use the Zustand store for schedule table logic
  const scheduledCourses = useScheduleTableStore((state) => state.scheduledCourses)
  const addCourseToSchedule = useScheduleTableStore((state) => state.addCourseToSchedule)
  const removeCourseFromSchedule = useScheduleTableStore((state) => state.removeCourseFromSchedule)
  const table = useScheduleTableStore((state) => state.table) // Get the table state

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

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Course List - Left Side */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            {selectedDept && ( // Only show CourseList if a department is selected
              <div className="sticky top-6">
                {courseLoading ? (
                  <div className="bg-white rounded-lg shadow-sm p-8">
                    <div className="animate-pulse space-y-4">
                      <div className="h-5 bg-gray-200 rounded w-1/2"></div>
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-12 bg-gray-200 rounded"></div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <CourseList courses={filteredCourses} onCourseClick={handleCourseClick} />
                )}
              </div>
            )}
          </div>

          {/* Weekly Table - Right Side */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {/* WeeklyTable is always rendered */}
              <WeeklyTable
                days={days}
                timeSlots={timeSlots}
                table={table} // Pass the table state
                scheduledCourses={scheduledCourses} // Still needed for remove logic
                onRemoveCourse={removeCourseFromSchedule}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Course Modal */}
      <CourseModal
        isOpen={isModalOpen}
        onClose={closeModal}
        course={selectedCourse}
        onAddToSchedule={addCourseToSchedule}
      />
    </div>
  )
}

export default WeeklySchedulePage
