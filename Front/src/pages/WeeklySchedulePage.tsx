"use client"

import type React from "react"
import { useEffect } from "react"
import { useScheduleDataStore } from "../store/schedule/useScheduleDataStore"
import { useScheduleTableStore, days, timeSlots } from "../store/schedule/useScheduleTableStore"
import { useCourseModalStore } from "../store/schedule/useCourseModalStore"
import { usePdfExportStore } from "../store/common/usePdfExportStore"

import DepartmentList from "../components/Schedule/DepartmentList"
import WeeklyTable from "../components/Schedule/WeeklyTable"
import CourseModal from "../components/Schedule/CourseModal"
import ScheduledCourseSummary from "../components/Schedule/ScheduledCourseSummary"
import CourseList from "../components/Schedule/CourseList"
import { ArrowRight } from "lucide-react"
import type { CourseResponse } from "../types"
import toast, { Toaster } from "react-hot-toast"

const WeeklySchedulePage: React.FC = () => {
  const {
    departments,
    isLoadingDepartments,
    isLoadingCourses,
    fetchDepartments,
    fetchCourses,
    selectedDept,
    setSelectedDept,
    getCoursesByDepartment,
  } = useScheduleDataStore()

  const scheduledCourses = useScheduleTableStore((state) => state.scheduledCourses)
  const addCourseToSchedule = useScheduleTableStore((state) => state.addCourseToSchedule)
  const removeCourseFromSchedule = useScheduleTableStore((state) => state.removeCourseFromSchedule)
  const table = useScheduleTableStore((state) => state.table)

  const { isExporting, exportPdf } = usePdfExportStore()

  const { isOpen: isModalOpen, selectedCourse, isScheduledCourseInModal, openModal, closeModal } = useCourseModalStore()

  useEffect(() => {
    fetchDepartments()
    fetchCourses()
  }, [fetchCourses, fetchDepartments])

  const filteredCourses = selectedDept ? getCoursesByDepartment(selectedDept) : []

  const handleCourseClick = (course: CourseResponse) => {
    const isScheduled = scheduledCourses.some((c) => c.course.id === course.course.id)
    openModal(course, isScheduled)
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
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-1 sm:px-6 py-1 sm:py-4 relative">
          <a
            href="/"
            className="hidden sm:inline-flex items-center px-1.5 sm:px-4 py-1 sm:py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium text-xs sm:text-base absolute top-4 right-6"
          >
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
            بازگشت
          </a>

          <div className="text-center">
            <h1 className="text-sm sm:text-2xl font-bold text-gray-900">برنامه هفتگی دانشجو</h1>
            <p className="text-gray-600 mt-0.5 sm:mt-1 text-xs sm:text-base">
              دپارتمان و درس مورد نظر خود را انتخاب کنید
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-1 sm:px-6 py-1 sm:py-4">
        <div className="mb-1 sm:mb-4">
          <DepartmentList
            departments={Array.isArray(departments) ? departments : []}
            selectedDept={selectedDept}
            onSelect={setSelectedDept}
            isLoading={isLoadingDepartments}
          />
        </div>
        {selectedDept && (
          <div className="mt-5 sm:mt-4 mb-5 sm:mb-4">
            <CourseList courses={filteredCourses} onCourseClick={handleCourseClick} isLoading={isLoadingCourses} />
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-1 sm:gap-4 lg:gap-6 items-stretch min-h-[350px] sm:min-h-[500px]">
          <div className="lg:w-1/4 flex-shrink-0 order-2 lg:order-1">
            <div className="lg:sticky lg:top-14">
              <ScheduledCourseSummary scheduledCourses={scheduledCourses} onCourseClick={handleCourseClick} />
            </div>
          </div>
          <div className="lg:w-3/4 flex-grow order-1 lg:order-2">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden h-full">
              <WeeklyTable
                days={days}
                timeSlots={timeSlots}
                table={table}
                scheduledCourses={scheduledCourses}
                onRemoveCourse={handleRemoveCourse}
                onExportPdf={() => exportPdf({ scheduledCourses, table, days, timeSlots })}
                isExporting={isExporting}
              />
            </div>
          </div>
        </div>
      </div>

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
