import type React from "react"
import type { DepartmentDetail } from "../../types"
import { useNavigate } from "react-router-dom"
import { Building2 } from "lucide-react"

interface DepartmentDetailModalProps {
  isOpen: boolean
  onClose: () => void
  department: DepartmentDetail | null
}

const DepartmentDetailModal: React.FC<DepartmentDetailModalProps> = ({ isOpen, onClose, department }) => {
  const navigate = useNavigate()

  if (!isOpen || !department) return null

  const handleViewCourses = () => {
    navigate(`/courses?deptId=${department.id}`)
    onClose()
  }

  const handleViewInstructors = () => {
    navigate(`/instructors?deptId=${department.id}&mode=department`)
    onClose()
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
        <div className="p-7 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">جزئیات دپارتمان</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-7 text-center">
          <div className="mb-6">
            <Building2 className="w-20 h-20 text-green-600 mx-auto mb-4" />
            <h3 className="text-3xl font-bold text-gray-900">{department.name}</h3>
          </div>

          <div className="space-y-4 text-lg text-gray-700">
            <p className="flex items-center justify-center">
              <svg className="w-6 h-6 text-indigo-500 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span className="font-bold mr-1">{department.instructors_count}</span> استاد
            </p>
            <p className="flex items-center justify-center">
              <svg className="w-6 h-6 text-emerald-500 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              <span className="font-bold mr-1">{department.courses_count}</span> درس
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-7 border-t border-gray-200 bg-gray-50">
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleViewCourses}
              className="flex-1 bg-indigo-600 text-white px-5 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
            >
              مشاهده دروس
            </button>
            <button
              onClick={handleViewInstructors}
              className="flex-1 bg-green-600 text-white px-5 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
            >
              مشاهده اساتید
            </button>
          </div>
          <button
            onClick={onClose}
            className="mt-4 w-full bg-gray-200 text-gray-800 px-5 py-3 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
          >
            بستن
          </button>
        </div>
      </div>
    </div>
  )
}

export default DepartmentDetailModal
