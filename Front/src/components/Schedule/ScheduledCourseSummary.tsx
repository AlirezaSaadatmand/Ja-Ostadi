"use client"

import type React from "react"
import type { CourseResponse } from "../../types"

interface ScheduledCourseSummaryProps {
  scheduledCourses: CourseResponse[]
  onCourseClick: (course: CourseResponse) => void
}

const ScheduledCourseSummary: React.FC<ScheduledCourseSummaryProps> = ({ scheduledCourses, onCourseClick }) => {
  const totalUnits = scheduledCourses.reduce((sum, course) => sum + course.course.units, 0)

  return (
    <div className="bg-white rounded-lg shadow-sm flex flex-col h-full">
      <div className="p-5 border-b border-gray-200 flex-shrink-0">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center justify-center">
          <svg className="w-5 h-5 ml-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
            />
          </svg>
          دروس برنامه ریزی شده ({scheduledCourses.length})
        </h3>
      </div>

      <div className="p-5 border-b border-gray-200 bg-gray-50 flex-shrink-0">
        <div className="flex justify-between items-center text-sm font-medium text-gray-700">
          <span>تعداد کل واحدها:</span>
          <span className="text-purple-700 text-lg font-bold">{totalUnits}</span>
        </div>
      </div>

      <div className="flex-grow overflow-y-auto">
        {scheduledCourses.length === 0 ? (
          <div className="p-8 text-center">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
              />
            </svg>
            <p className="text-gray-500">هیچ درسی در برنامه شما نیست</p>
          </div>
        ) : (
          <div className="p-3">
            {scheduledCourses.map((course) => (
              <div
                key={course.course.id}
                className="p-3 m-2 rounded-lg bg-gray-50 border border-gray-200 transition-all duration-200 cursor-pointer hover:bg-gray-100" // Added cursor and hover effect
                onClick={() => onCourseClick(course)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <span className="font-medium text-gray-800 block">{course.course.name}</span>
                    <div className="flex items-center space-x-2 space-x-reverse mt-1">
                      <span className="text-xs text-gray-500">استاد: {course.instructor.name}</span>
                      <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                        {course.course.units} واحد
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ScheduledCourseSummary
