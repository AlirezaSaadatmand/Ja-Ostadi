"use client"

import type React from "react"
import { useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { useInstructorListStore } from "../store/instructors/useInstructorListStore" // Updated import
import { useDepartmentsPageStore } from "../store/departments/useDepartmentsPageStore" // Updated import
import { useSemesterStore } from "../store/common/useSemesterStore" // Updated import
import InstructorList from "../components/Instructor/InstructorList"
import ToggleFilter from "../components/common/ToggleFilter"

const InstructorsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const {
    fetchInstructors,
    selectedDepartmentId,
    setSelectedDepartmentId,
    selectedSemesterId,
    setSelectedSemesterId,
    filterByMode,
    setFilterByMode,
  } = useInstructorListStore() // Updated store
  const { departments, fetchDepartmentsDetail } = useDepartmentsPageStore() // Updated store
  const { semesters, fetchSemesters } = useSemesterStore() // Updated store

  useEffect(() => {
    fetchInstructors()
    fetchDepartmentsDetail() // Fetch detailed departments for filter
    fetchSemesters()
  }, [fetchInstructors, fetchDepartmentsDetail, fetchSemesters])

  useEffect(() => {
    const urlDeptId = searchParams.get("deptId")
    const urlSemId = searchParams.get("semId")
    const urlMode = searchParams.get("mode") as "department" | "semester" | null

    if (urlDeptId && !isNaN(Number(urlDeptId))) {
      setSelectedDepartmentId(Number(urlDeptId))
    }
    if (urlSemId && !isNaN(Number(urlSemId))) {
      setSelectedSemesterId(Number(urlSemId))
    }
    if (urlMode && (urlMode === "department" || urlMode === "semester")) {
      setFilterByMode(urlMode)
    }
  }, [searchParams, setSelectedDepartmentId, setSelectedSemesterId, setFilterByMode])

  useEffect(() => {
    if (departments.length > 0 && selectedDepartmentId === null) {
      setSelectedDepartmentId(departments[0].id)
    }
  }, [departments, selectedDepartmentId, setSelectedDepartmentId])

  useEffect(() => {
    if (semesters.length > 0 && selectedSemesterId === null) {
      setSelectedSemesterId(semesters[0].id)
    }
  }, [semesters, selectedSemesterId, setSelectedSemesterId])

  useEffect(() => {
    const newSearchParams = new URLSearchParams(searchParams.toString())
    if (selectedDepartmentId !== null) {
      newSearchParams.set("deptId", selectedDepartmentId.toString())
    } else {
      newSearchParams.delete("deptId")
    }
    if (selectedSemesterId !== null) {
      newSearchParams.set("semId", selectedSemesterId.toString())
    } else {
      newSearchParams.delete("semId")
    }
    newSearchParams.set("mode", filterByMode)
    setSearchParams(newSearchParams, { replace: true })
  }, [selectedDepartmentId, selectedSemesterId, filterByMode, setSearchParams, searchParams])

  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDeptId = e.target.value ? Number(e.target.value) : null
    setSelectedDepartmentId(newDeptId)
  }

  const handleSemesterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSemId = e.target.value ? Number(e.target.value) : null
    setSelectedSemesterId(newSemId)
  }

  const handleFilterModeChange = (mode: "department" | "semester") => {
    setFilterByMode(mode)
  }

  return (
    <div className="min-h-screen bg-gray-100" dir="rtl">
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
        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 text-center mb-6">فیلتر اساتید</h2>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <div className="w-full sm:w-1/2 lg:w-1/3">
              <label htmlFor="department-filter" className="block text-sm font-medium text-gray-700 mb-2">
                فیلتر بر اساس دپارتمان:
              </label>
              <select
                id="department-filter"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm"
                value={selectedDepartmentId !== null ? selectedDepartmentId : ""}
                onChange={handleDepartmentChange}
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
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm"
                value={selectedSemesterId !== null ? selectedSemesterId : ""}
                onChange={handleSemesterChange}
              >
                {semesters.map((semester) => (
                  <option key={semester.id} value={semester.id}>
                    {semester.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-full sm:w-auto flex items-center justify-center mt-4 sm:mt-0">
              <ToggleFilter value={filterByMode} onValueChange={handleFilterModeChange} />
            </div>
          </div>
        </div>
        <InstructorList departments={departments} semesters={semesters} />
      </div>
    </div>
  )
}

export default InstructorsPage
