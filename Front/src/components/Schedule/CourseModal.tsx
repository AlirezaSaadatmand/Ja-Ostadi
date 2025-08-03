"use client"

import type React from "react"
import type { CourseResponse } from "../../types"

interface CourseModalProps {
  isOpen: boolean
  onClose: () => void
  course: CourseResponse | null
  onAddToSchedule: (course: CourseResponse) => void
  onRemoveFromSchedule?: (courseId: number) => void
  isScheduledCourse?: boolean
}

const CourseModal: React.FC<CourseModalProps> = ({
  isOpen,
  onClose,
  course,
  onAddToSchedule,
  onRemoveFromSchedule,
  isScheduledCourse,
}) => {
  if (!isOpen || !course) return null

  const handleAddToSchedule = () => {
    onAddToSchedule(course)
    onClose()
  }

  const handleRemoveFromSchedule = () => {
    if (onRemoveFromSchedule) {
      onRemoveFromSchedule(course.course.id)
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      dir="rtl"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-7 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">جزئیات درس</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-7">
          <div className="space-y-4">
            {/* Course Name */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{course.course.name}</h3>
              <div className="flex items-center space-x-4 space-x-reverse text-base text-gray-600">
                <span className="bg-blue-100 text-blue-800 px-3 py-1.5 rounded">کد: {course.course.number}</span>
                <span className="bg-green-100 text-green-800 px-3 py-1.5 rounded">گروه: {course.course.group}</span>
                <span className="bg-purple-100 text-purple-800 px-3 py-1.5 rounded">{course.course.units} واحد</span>
              </div>
            </div>

            {/* Department */}
            <div className="flex items-center">
              <svg className="w-6 h-6 text-gray-400 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              <span className="text-gray-800">
                <strong>دپارتمان:</strong> {course.department.name}
              </span>
            </div>

            {/* Instructor */}
            <div className="flex items-center">
              <svg className="w-6 h-6 text-gray-400 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span className="text-gray-800">
                <strong>استاد:</strong> {course.instructor.name}
              </span>
            </div>

            {/* Schedule Times */}
            <div>
              <div className="flex items-center mb-3">
                <svg className="w-6 h-6 text-gray-400 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-gray-700 font-medium">زمان‌های کلاس:</span>
              </div>
              <div className="space-y-2">
                {course.time.map((timeSlot, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 space-x-reverse">
                        <span className="font-semibold text-gray-900">{timeSlot.day}</span>
                        <span className="text-gray-600">
                          {timeSlot.start_time} - {timeSlot.end_time}
                        </span>
                      </div>
                      <span className="text-base bg-indigo-100 text-indigo-800 px-3 py-1.5 rounded">
                        {timeSlot.room}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-7 border-t border-gray-200 bg-gray-50">
          <div className="flex space-x-3 space-x-reverse">
            {isScheduledCourse ? (
              <button
                onClick={handleRemoveFromSchedule}
                className="flex-1 bg-red-600 text-white px-5 py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold"
              >
                حذف از برنامه
              </button>
            ) : (
              <button
                onClick={handleAddToSchedule}
                className="flex-1 bg-indigo-600 text-white px-5 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
              >
                افزودن به برنامه
              </button>
            )}
            <button
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-800 px-5 py-3 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
            >
              انصراف
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseModal
