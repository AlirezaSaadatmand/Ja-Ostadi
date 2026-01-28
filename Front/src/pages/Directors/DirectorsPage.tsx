import React, { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Book, LogOut, Shield } from "lucide-react"

import { useAuthStore } from "../../store/auth/useAuthStore"
import { useTempCourseStore } from "../../store/tempCourse/useTempCourseStore"
import Header from "../../components/Header"
import ContributorsSection from "../../components/Contributors/ContributorsSection"

const TERMS = ["2", "4", "6", "8"]

const DirectorsPage: React.FC = () => {
  const navigate = useNavigate()

  const { user, isAuthenticated, hasHydrated, logout } =
    useAuthStore()

  const { tempCourses, fetchTempCourses, isLoading } =
    useTempCourseStore()

  const [selectedTerm, setSelectedTerm] = useState("")

  useEffect(() => {
    if (!hasHydrated) return

    if (!isAuthenticated) {
      navigate("/login", { replace: true })
      return
    }

    if (user?.role !== "director") {
      navigate("/", { replace: true })
      return
    }

    fetchTempCourses()
  }, [hasHydrated, isAuthenticated, user, navigate, fetchTempCourses])

  const handleLogout = () => {
    logout()
    navigate("/login", { replace: true })
  }

  const filteredCourses = useMemo(() => {
    if (!selectedTerm) return []
    return tempCourses.filter(
      (c) => c.targetTerm === selectedTerm
    )
  }, [tempCourses, selectedTerm])

  if (!hasHydrated) return null

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex flex-col items-center p-4 sm:p-8 font-sans relative"
      dir="rtl"
    >
      <Header />
      <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10">
        <ContributorsSection />
      </div>

      <div className="w-full max-w-7xl mt-20 space-y-8">

        {/* HEADER CARD */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#AB8A58]/10 rounded-xl">
                <Shield className="w-10 h-10 text-[#AB8A58]" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  پنل مدیر گروه
                </h1>
                <p className="text-gray-600 mt-1">
                  خوش آمدید، {user?.username}
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg"
            >
              <LogOut size={18} />
              خروج
            </button>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">
            دروس موقت
          </h2>

          <button
            onClick={() =>
              navigate("/directors/temp-courses/new")
            }
            className="flex items-center gap-2 px-4 py-2 bg-[#AB8A58] text-white rounded-xl hover:opacity-90"
          >
            <Book size={18} />
            افزودن درس
          </button>
        </div>

        {/* TERM FILTER */}
        <div className="bg-white rounded-xl shadow p-4 flex gap-4 items-center">
          <span className="text-sm text-gray-700">
            انتخاب ترم:
          </span>

          <select
            value={selectedTerm}
            onChange={(e) =>
              setSelectedTerm(e.target.value)
            }
            className="rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-[#AB8A58]"
          >
            <option value="">---</option>
            {TERMS.map((t) => (
              <option key={t} value={t}>
                ترم {t}
              </option>
            ))}
          </select>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-2xl shadow overflow-x-auto">
          <table className="w-full text-sm text-center">
            <thead className="bg-gray-50 text-gray-700">
              <tr>
                <th className="p-3">دپارتمان</th>
                <th className="p-3">نام درس</th>
                <th className="p-3">گروه</th>
                <th className="p-3">واحد</th>
                <th className="p-3">استاد</th>
                <th className="p-3">زمان کلاس</th>
              </tr>
            </thead>

            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={6} className="p-6">
                    در حال بارگذاری...
                  </td>
                </tr>
              )}

              {!isLoading && filteredCourses.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-6 text-gray-500">
                    درسی برای این ترم ثبت نشده است
                  </td>
                </tr>
              )}

              {filteredCourses.map((course) => (
                <tr
                  key={course.id}
                  className="border-t hover:bg-gray-50"
                >
                  <td className="p-3">{course.department}</td>
                  <td className="p-3 font-medium">
                    {course.courseName}
                  </td>
                  <td className="p-3">{course.group}</td>
                  <td className="p-3">{course.units}</td>
                  <td className="p-3">{course.instructor}</td>
                  <td className="p-3 text-xs">
                    {course.firstDay} {course.firstTime}
                    {course.secondDay && (
                      <>
                        <br />
                        {course.secondDay} {course.secondTime}
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  )
}

export default DirectorsPage
