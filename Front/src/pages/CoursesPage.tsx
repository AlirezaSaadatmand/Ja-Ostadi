"use client"

import type React from "react"
import { useEffect } from "react"
import { useSearchParams, Link } from "react-router-dom"
import { useCoursesPageStore } from "../store/courses/useCoursesPageStore"
import { useSemesterStore } from "../store/common/useSemesterStore"
import { useDepartmentsPageStore } from "../store/departments/useDepartmentsPageStore"
import { BookOpen } from "lucide-react"
import Header from "../components/Header"

const CoursesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const {
    courses,
    isLoading,
    error,
    fetchCourses,
    selectedSemesterId,
    setSelectedSemesterId,
    selectedDepartmentId,
    setSelectedDepartmentId,
  } = useCoursesPageStore()

  const { semesters, fetchSemesters } = useSemesterStore()
  const { departments, fetchDepartmentsDetail } = useDepartmentsPageStore()

  useEffect(() => {
    fetchSemesters()
    fetchDepartmentsDetail()
  }, [fetchSemesters, fetchDepartmentsDetail])

  useEffect(() => {
    const urlSemId = searchParams.get("semId")
    const urlDeptId = searchParams.get("deptId")

    if (urlSemId && !isNaN(Number(urlSemId))) {
      setSelectedSemesterId(Number(urlSemId))
    }
    if (urlDeptId && !isNaN(Number(urlDeptId))) {
      setSelectedDepartmentId(Number(urlDeptId))
    }
  }, [searchParams, setSelectedSemesterId, setSelectedDepartmentId])

  useEffect(() => {
    if (semesters.length > 0 && selectedSemesterId === null) {
      setSelectedSemesterId(semesters[0].id)
    }
  }, [semesters, selectedSemesterId, setSelectedSemesterId])

  useEffect(() => {
    if (departments.length > 0 && selectedDepartmentId === null) {
      setSelectedDepartmentId(departments[0].id)
    }
  }, [departments, selectedDepartmentId, setSelectedDepartmentId])

  useEffect(() => {
    if (selectedSemesterId !== null && selectedDepartmentId !== null) {
      fetchCourses(selectedSemesterId, selectedDepartmentId)
    }
  }, [selectedSemesterId, selectedDepartmentId, fetchCourses])

  useEffect(() => {
    const newSearchParams = new URLSearchParams(searchParams.toString())
    if (selectedSemesterId !== null) {
      newSearchParams.set("semId", selectedSemesterId.toString())
    } else {
      newSearchParams.delete("semId")
    }
    if (selectedDepartmentId !== null) {
      newSearchParams.set("deptId", selectedDepartmentId.toString())
    } else {
      newSearchParams.delete("deptId")
    }
    setSearchParams(newSearchParams, { replace: true })
  }, [selectedSemesterId, selectedDepartmentId, setSearchParams, searchParams])

  const handleSemesterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSemId = e.target.value ? Number(e.target.value) : null
    setSelectedSemesterId(newSemId)
  }

  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDeptId = e.target.value ? Number(e.target.value) : null
    setSelectedDepartmentId(newDeptId)
  }

  return (
    <div className="min-h-screen bg-gray-100" dir="rtl">
      <Header />

      {/* <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-10 flex items-center justify-between">
          <div className="text-center flex-1">
            <h1 className="text-4xl font-bold text-gray-900">دروس دانشگاه</h1>
            <p className="text-gray-600 mt-3 text-xl">لیست دروس بر اساس ترم و دپارتمان</p>
          </div>

          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium"
          >
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            بازگشت
          </Link>
        </div>
      </div> */}

      <div className="max-w-7xl mx-auto px-6 py-8 mt-20">
        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 text-center mb-6">فیلتر دروس</h2>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <div className="w-full sm:w-1/2 lg:w-1/3">
              <label htmlFor="semester-filter" className="block text-sm font-medium text-gray-700 mb-2">
                انتخاب ترم:
              </label>
              <select
                id="semester-filter"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm"
                value={selectedSemesterId !== null ? selectedSemesterId : ""}
                onChange={handleSemesterChange}
                disabled={semesters.length === 0}
              >
                {semesters.length === 0 ? (
                  <option value="">در حال بارگذاری ترم‌ها...</option>
                ) : (
                  semesters.map((semester) => (
                    <option key={semester.id} value={semester.id}>
                      {semester.name}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div className="w-full sm:w-1/2 lg:w-1/3">
              <label htmlFor="department-filter" className="block text-sm font-medium text-gray-700 mb-2">
                انتخاب دپارتمان:
              </label>
              <select
                id="department-filter"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm"
                value={selectedDepartmentId !== null ? selectedDepartmentId : ""}
                onChange={handleDepartmentChange}
                disabled={departments.length === 0}
              >
                {departments.length === 0 ? (
                  <option value="">در حال بارگذاری دپارتمان‌ها...</option>
                ) : (
                  departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>
        </div>

        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-md p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="col-span-full text-center py-12 text-red-600">
            <p className="text-lg">خطا در بارگذاری دروس: {error}</p>
          </div>
        )}

        {!isLoading && !error && courses.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">هیچ درسی با فیلترهای انتخاب شده یافت نشد.</p>
          </div>
        )}

        {!isLoading && !error && courses.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Link
                key={course.ID}
                to={`/courses/${course.ID}`}
                className="group bg-white rounded-xl shadow-md p-8 flex flex-col items-center text-center border border-gray-200 transition-all duration-300 cursor-pointer hover:shadow-xl hover:border-emerald-400 hover:bg-gradient-to-br from-white to-emerald-50"
              >
                <div className="mb-4">
                  <BookOpen className="w-14 h-14 text-emerald-600 mx-auto" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">{course.CourseName}</h2>
                <div className="text-gray-700 text-lg space-y-4">
                  <p className="flex items-center justify-center">
                    {course.InstructorName ? 
                      <svg
                        className="w-6 h-6 text-[#059669]"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="7" r="4" />
                        <path d="M5.5 21h13a2 2 0 002-2v-1a4 4 0 00-4-4H7a4 4 0 00-4 4v1a2 2 0 002 2z" />
                      </svg> : null
                    }
                    <span className="font-bold mr-1">{course.InstructorName ? course.InstructorName : "استاد مشخص نشده"}</span>
                  </p>
                </div>   
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default CoursesPage
