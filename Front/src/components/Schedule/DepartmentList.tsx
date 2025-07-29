"use client"

import type React from "react"
import type { Department } from "../../types"

interface DepartmentListProps {
  departments: Department[]
  selectedDept: number | null
  onSelect: (id: number) => void
  isLoading: boolean
}

const DepartmentList: React.FC<DepartmentListProps> = ({ departments, selectedDept, onSelect, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="animate-pulse">
          <div className="h-5 bg-gray-200 rounded w-32 mb-6"></div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center justify-center">
        <svg className="w-6 h-6 ml-3 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
        دپارتمان‌ها
      </h2>

      {departments.length === 0 ? (
        <div className="text-center py-12">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
          <p className="text-gray-500">هیچ دپارتمانی یافت نشد</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {departments.map((dept) => (
            <button
              key={dept.id}
              className={`p-4 rounded-lg text-center transition-all duration-200 border-2 ${
                selectedDept === dept.id
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-lg transform scale-105"
                  : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-indigo-50 hover:border-indigo-300 hover:shadow-md"
              }`}
              onClick={() => onSelect(dept.id)}
            >
              <div className="font-medium text-sm leading-tight">{dept.name}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default DepartmentList
