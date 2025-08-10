"use client"

import type React from "react"
import type { CourseResponse } from "../../types"

interface CourseListProps {
  courses: CourseResponse[]
  onCourseClick: (course: CourseResponse) => void
  isLoading: boolean
}

const CourseList: React.FC<CourseListProps> = ({ courses, onCourseClick, isLoading }) => {
  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-5 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="grid grid-flow-col grid-rows-2 gap-4 pb-2 overflow-x-auto scrollbar-hide auto-cols-max">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-28 w-56 bg-gray-200 rounded flex-shrink-0"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-5">
      <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center justify-center">
        <svg className="w-5 h-5 ml-3 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
        دروس موجود ({courses.length})
      </h3>
      {courses.length === 0 ? (
        <div className="p-8 text-center col-span-full">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          {courses.map((course) => (
            <div
              key={course.course.id}
              className="p-5 rounded-lg bg-gray-50 hover:bg-emerald-50 border border-gray-200 hover:border-emerald-300 transition-all duration-200 cursor-pointer"
              onClick={() => onCourseClick(course)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 text-right ml-2">
                  <span className="font-semibold text-gray-900 text-base block">{course.course.name}</span>
                  <span className="text-sm text-gray-500 block mt-1">استاد: {course.instructor.name}</span>
                </div>
                <span className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded flex-shrink-0">
                  {course.course.units} واحد
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default CourseList
