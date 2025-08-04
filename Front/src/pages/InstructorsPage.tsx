"use client"

import type React from "react"
import { useEffect } from "react"
import { useInstructorStore } from "../store/useInstructorStore"
import { useDepartmentStore } from "../store/useScheduleStore"
import { useSemesterStore } from "../store/useSemesterStore"
import InstructorList from "../components/Instructor/InstructorList"

const InstructorsPage: React.FC = () => {
  const { fetchInstructors, selectedDepartmentId, setSelectedDepartmentId, selectedSemesterId, setSelectedSemesterId } =
    useInstructorStore()
  const { departments, fetchDepartments } = useDepartmentStore()
  const { semesters, fetchSemesters } = useSemesterStore()

  useEffect(() => {
    fetchInstructors()
    fetchDepartments()
    fetchSemesters()
  }, [fetchInstructors, fetchDepartments, fetchSemesters])

  useEffect(() => {
    if (selectedDepartmentId === null && departments.length > 0) {
      setSelectedDepartmentId(departments[0].id)
    }
    if (selectedSemesterId === null && semesters.length > 0) {
      setSelectedSemesterId(semesters[0].id)
    }
  }, [departments, semesters, selectedDepartmentId, selectedSemesterId, setSelectedDepartmentId, setSelectedSemesterId])

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-10 flex items-center justify-between">
          <div className="text-center flex-1">
            <h1 className="text-4xl font-bold text-gray-900">اساتید دانشگاه</h1>
            <p className="text-gray-600 mt-3 text-xl">لیست اساتید و جزئیات تماس آنها</p>
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
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <div className="w-full sm:w-1/2 lg:w-1/3">
            <label htmlFor="department-filter" className="block text-sm font-medium text-gray-700 mb-2">
              فیلتر بر اساس دپارتمان:
            </label>
            <select
              id="department-filter"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              value={selectedDepartmentId || ""}
              onChange={(e) => setSelectedDepartmentId(e.target.value ? Number(e.target.value) : null)}
            >
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full sm:w-1/2 lg:w-1/3">
            <label htmlFor="semester-filter" className="block text-sm font-medium text-gray-700 mb-2">
              فیلتر بر اساس ترم:
            </label>
            <select
              id="semester-filter"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              value={selectedSemesterId || ""}
              onChange={(e) => setSelectedSemesterId(e.target.value ? Number(e.target.value) : null)}
            >
              {semesters.map((semester) => (
                <option key={semester.id} value={semester.id}>
                  {semester.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <InstructorList />
      </div>
    </div>
  )
}

export default InstructorsPage
