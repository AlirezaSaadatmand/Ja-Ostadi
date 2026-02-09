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
      <div className="bg-white rounded-lg shadow-sm p-3 sm:p-6">
        <div className="animate-pulse">
          <div className="h-4 sm:h-5 bg-gray-200 rounded w-24 sm:w-32 mb-3 sm:mb-6"></div>
          <div className="flex overflow-x-auto gap-2 sm:gap-4 pb-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-8 sm:h-12 w-20 sm:w-36 bg-gray-200 rounded-lg flex-shrink-0"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-3 sm:p-6 ">
      <h2 className="text-lg sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-6 flex items-center justify-center">
        <svg
          className="w-4 h-4 sm:w-6 sm:h-6 ml-2 sm:ml-3 text-indigo-600"
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
        دپارتمان‌ها
      </h2>

      {departments.length === 0 ? (
        <div className="text-center py-6 sm:py-12">
          <svg
            className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-2 sm:mb-4"
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
          <p className="text-gray-500 text-sm sm:text-base">هیچ دپارتمانی یافت نشد</p>
        </div>
      ) : (
        <div className="flex overflow-x-auto gap-2 sm:gap-4 pb-2 scrollbar-hide">
          {departments.map((dept) => (
            <button
              key={dept.id}
              className={`p-2 sm:p-5 rounded-lg text-center transition-all duration-200 border-2 flex-shrink-0 ${
                selectedDept === dept.id
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-lg transform scale-105"
                  : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-indigo-50 hover:border-indigo-300 hover:shadow-md"
              } w-20 sm:w-40`}
              onClick={() => onSelect(dept.id)}
            >
              <div className="font-medium text-xs sm:text-base leading-tight">{dept.name}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default DepartmentList
