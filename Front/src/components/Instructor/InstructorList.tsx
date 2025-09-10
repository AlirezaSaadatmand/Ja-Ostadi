"use client"

import type React from "react"

import { GraduationCap, BookUser } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useInstructorListStore } from "../../store/instructors/useInstructorListStore"
import type { Department, Semester } from "../../types"

interface InstructorListProps {
  departments: Department[]
  semesters: Semester[]
}

const InstructorList: React.FC<InstructorListProps> = ({ departments, semesters }) => {
  const navigate = useNavigate()
  const { isLoading, error, getFilteredInstructors } = useInstructorListStore()

  const instructors = getFilteredInstructors(departments, semesters)

  const handleInstructorClick = (instructorId: number) => {
    navigate(`/instructors/${instructorId}`)
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-md p-3 sm:p-6 animate-pulse">
            <div className="h-10 w-10 sm:h-16 sm:w-16 bg-gray-200 rounded-full mx-auto mb-2 sm:mb-4"></div>
            <div className="h-4 sm:h-6 bg-gray-200 rounded w-3/4 mx-auto mb-2 sm:mb-4"></div>
            <div className="h-3 sm:h-4 bg-gray-200 rounded w-1/2 mx-auto mb-1 sm:mb-2"></div>
            <div className="h-3 sm:h-4 bg-gray-200 rounded w-2/3 mx-auto"></div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="col-span-full text-center py-12 text-red-600">
        <p className="text-lg">خطا در بارگذاری اساتید: {error}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
      {instructors.length === 0 ? (
        <div className="col-span-full text-center py-12">
          <GraduationCap className="w-12 h-12 sm:w-20 sm:h-20 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-sm sm:text-lg">هیچ استادی یافت نشد.</p>
        </div>
      ) : (
        instructors
          .filter((item) => item.instructor?.name && item.instructor.name.trim() !== "")
          .map((item, index) => (
            <div
              key={`${item.relations.instructor_id}-${index}`}
              onClick={() => handleInstructorClick(item.relations.instructor_id)}
              className="group bg-white rounded-xl shadow-md p-3 sm:p-8 flex flex-col items-center text-center border border-gray-200 transition-all duration-300 cursor-pointer hover:shadow-xl hover:border-blue-400 hover:bg-gradient-to-br from-white to-blue-50"
            >
              <div className="mb-2 sm:mb-6">
                <BookUser className="w-8 h-8 sm:w-14 sm:h-14 text-blue-600 mx-auto" />
              </div>
              <h2 className="text-sm sm:text-2xl font-semibold text-gray-900 mb-2 sm:mb-4">{item.instructor.name}</h2>
              <div className="text-gray-700 text-xs sm:text-lg space-y-1 sm:space-y-2">
                <p className="flex items-center justify-center">
                  <svg
                    className="w-4 h-4 sm:w-6 sm:h-6 text-indigo-500 ml-1 sm:ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                  <span className="font-bold mr-1">{item.instructor.field}</span>
                </p>
              </div>
            </div>
          ))
      )}
    </div>
  )
}

export default InstructorList
