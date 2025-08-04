"use client"

import { UserRound, GraduationCap } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useInstructorStore } from "../../store/useInstructorStore"

const InstructorList = () => {
  const navigate = useNavigate()
  const { isLoading, error, getFilteredInstructors } = useInstructorStore()

  const instructors = getFilteredInstructors()

  const handleInstructorClick = (instructorId: number) => {
    navigate(`/instructors/${instructorId}`)
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-md p-6 animate-pulse">
            <div className="h-16 w-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto"></div>
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {instructors.length === 0 ? (
        <div className="col-span-full text-center py-12">
          <UserRound className="w-20 h-20 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">هیچ استادی یافت نشد.</p>
        </div>
      ) : (
        instructors.map((item, index) => (
          <div
            key={`${item.relations.instructor_id}-${index}`}
            onClick={() => handleInstructorClick(item.relations.instructor_id)}
            className="group bg-white rounded-xl shadow-md p-8 flex flex-col items-center text-center border border-gray-200 transition-all duration-300 cursor-pointer hover:shadow-xl hover:border-blue-400 hover:bg-gradient-to-br from-white to-blue-50"
          >
            <div className="mb-6">
              <GraduationCap className="w-14 h-14 text-blue-600 mx-auto" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{item.instructor.name}</h2>
            <div className="text-gray-700 text-lg space-y-2">
              <p className="flex items-center justify-center">
                <svg className="w-6 h-6 text-indigo-500 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
