import type React from "react"
import type { CourseResponse } from "../../types"

interface ScheduledCourseSummaryProps {
  scheduledCourses: CourseResponse[]
  onCourseClick: (course: CourseResponse) => void
}

const ScheduledCourseSummary: React.FC<ScheduledCourseSummaryProps> = ({ scheduledCourses, onCourseClick }) => {
  const totalUnits = scheduledCourses.reduce((sum, course) => sum + parseFloat(course.course.units), 0)

  return (
    <div className="bg-white rounded-lg shadow-sm flex flex-col h-full max-h-[450px] sm:max-h-[550px] lg:max-h-[650px]">
      <div className="p-2 sm:p-3 border-b border-gray-200 flex-shrink-0">
        <h3 className="text-sm sm:text-base font-semibold text-gray-900 flex items-center justify-center">
          <svg
            className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2 text-purple-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
            />
          </svg>
          <span className="text-lg font-semibold sm:text-l">دروس برنامه ریزی شده ({scheduledCourses.length})</span>
        </h3>
      </div>

      <div className="p-2 sm:p-3 border-b border-gray-200 bg-gray-50 flex justify-between items-center text-xs font-medium text-gray-700 flex-shrink-0">
        <span>تعداد کل واحدها:</span>
        <span className="text-purple-700 text-sm sm:text-base font-bold">{totalUnits}</span>
      </div>

      <div className="flex-grow overflow-y-auto scrollbar-hide p-1 sm:p-2">
        {scheduledCourses.length === 0 ? (
          <div className="p-3 sm:p-4 text-center">
            <svg
              className="w-8 h-8 sm:w-10 sm:h-10 text-gray-300 mx-auto mb-1 sm:mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
              />
            </svg>
            <p className="text-gray-500 text-xs">هیچ درسی در برنامه شما نیست</p>
          </div>
        ) : (
          <div className="flex flex-col gap-1 sm:gap-1.5">
            {scheduledCourses.map((course) => (
              <div
                key={course.course.id}
                className="p-3 sm:p-5 rounded-lg bg-gray-50 hover:bg-purple-50 border border-gray-200 hover:border-purple-300 transition-all duration-200 cursor-pointer"
                onClick={() => onCourseClick(course)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 text-right ml-1 sm:ml-2">
                    <span className="font-semibold text-gray-900 text-sm sm:text-base block leading-tight">
                      {course.course.name}
                    </span>
                    <span className="text-xs sm:text-sm text-gray-500 block mt-0.5 sm:mt-1 leading-tight">
                      استاد: {course.instructor.name}
                    </span>
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs sm:text-sm bg-purple-100 text-purple-700 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded flex-shrink-0">
                      {course.course.units} واحد
                    </span>
                    <span className="text-xs sm:text-sm bg-green-100 text-green-700 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded flex-shrink-0">
                      گروه : {course.course.group}
                    </span>
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
