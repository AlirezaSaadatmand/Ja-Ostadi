"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useDepartmentDetailStore } from "../store/useDepartmentDetailStore"
import DepartmentDetailModal from "../components/Department/DepartmentDetailModal" // Import the new modal
import type { DepartmentDetail } from "../types"
import { Building2 } from "lucide-react" // Add this import

const DepartmentsPage: React.FC = () => {
  const { departments, isLoading, error, fetchDepartmentsDetail } = useDepartmentDetailStore()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedDepartment, setSelectedDepartment] = useState<DepartmentDetail | null>(null)

  useEffect(() => {
    fetchDepartmentsDetail()
  }, [fetchDepartmentsDetail])

  const handleDepartmentClick = (department: DepartmentDetail) => {
    setSelectedDepartment(department)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedDepartment(null)
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-10 flex items-center justify-between">
          <div className="text-center flex-1">
            <h1 className="text-4xl font-bold text-gray-900">دپارتمان‌ها</h1>
            <p className="text-gray-600 mt-3 text-xl">لیست دپارتمان‌ها با جزئیات</p>
          </div>

          <a
            href="/"
            className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium"
          >
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            بازگشت
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-md p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="text-center py-12 text-red-600">
            <p className="text-lg">خطا در بارگذاری دپارتمان‌ها: {error}</p>
          </div>
        )}

        {!isLoading && !error && departments.length === 0 && (
          <div className="text-center py-12">
            <svg className="w-20 h-20 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            <p className="text-gray-500 text-lg">هیچ دپارتمانی یافت نشد.</p>
          </div>
        )}

        {!isLoading && !error && departments.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {departments.map((dept) => (
              <div
                key={dept.id}
                onClick={() => handleDepartmentClick(dept)} // Open modal on click
                className="bg-white rounded-xl shadow-md p-8 flex flex-col items-center text-center hover:shadow-lg hover:border-indigo-300 border border-gray-200 transition-all duration-200 cursor-pointer"
              >
                <div className="mb-6">
                  <Building2 className="w-16 h-16 text-green-600 mx-auto" /> {/* Replaced SVG with Building2 icon */}
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">{dept.name}</h2>
                <div className="text-gray-700 text-lg space-y-2">
                  <p className="flex items-center justify-center">
                    <svg className="w-6 h-6 text-indigo-500 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <span className="font-bold mr-1">{dept.instructors_count}</span> استاد
                  </p>
                  <p className="flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-emerald-500 ml-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                    <span className="font-bold mr-1">{dept.courses_count}</span> درس
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <DepartmentDetailModal isOpen={isModalOpen} onClose={closeModal} department={selectedDepartment} />
    </div>
  )
}

export default DepartmentsPage
