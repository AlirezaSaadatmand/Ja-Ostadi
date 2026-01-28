import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowRight } from "lucide-react"

import { useTempCourseStore } from "../../store/tempCourse/useTempCourseStore"
import { useDepartmentsPageStore } from "../../store/departments/useDepartmentsPageStore"
import { useCoursesPageStore } from "../../store/courses/useCoursesPageStore"
import TimeDaySelector from "../../components/tempCourse/TimeDaySelector"
import type { DepartmentDetail } from "../../types"

const GROUPS = ["01", "02", "03"]
const UNITS = ["1", "2", "3", "4"]
const TERMS = ["2", "4", "6", "8"]

const CreateTempCoursePage: React.FC = () => {
  const navigate = useNavigate()

  const { departments, fetchDepartmentsDetail } =
    useDepartmentsPageStore()

  const { courses, fetchCourses } =
    useCoursesPageStore()

  const { createTempCourse, isLoading, error } =
    useTempCourseStore()

  const [selectedDepartment, setSelectedDepartment] =
    useState<DepartmentDetail | null>(null)

  const [showSecondClass, setShowSecondClass] = useState(false)
  const [showCourseSuggestions, setShowCourseSuggestions] = useState(false)

  const [showInstructorSuggestions, setShowInstructorSuggestions] = useState(false)

  const [form, setForm] = useState({
    department: "",
    courseName: "",
    group: "",
    units: "",
    instructor: "",
    targetTerm: "",

    firstRoom: "",
    firstDay: "",
    firstTime: "",
    firstLock: false,

    secondRoom: "",
    secondDay: "",
    secondTime: "",
    secondLock: false,

    finalExamDate: "",
    finalExamTime: "",
  })

  /* ------------------ effects ------------------ */

  useEffect(() => {
    fetchDepartmentsDetail()
  }, [fetchDepartmentsDetail])

  useEffect(() => {
    if (!selectedDepartment) return

    const semesterId = 65
    fetchCourses(semesterId, selectedDepartment.id)
  }, [selectedDepartment, fetchCourses])

  /* ------------------ helpers ------------------ */
  
  const handleSubmit = async () => {
    await createTempCourse(form)
    navigate(-1)
  }

  const normalizePersian = (input: string) => {
    return input
    .trim()
    .replace(/ي/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/\(کامپیوتر ج\)/g, "")
    .replace(/\(کامپیوتر\)/g, "")
    .replace(/\s+/g, " ")
    .trim()
  }
  
  const normalizedInstructorInput = normalizePersian(form.instructor)

  const instructorSuggestions = Array.from(
    new Set(
      courses
        .map((c) => normalizePersian(c.InstructorName))
        .filter(Boolean)
    )
  ).filter(
    (name) =>
      normalizedInstructorInput &&
      name.includes(normalizedInstructorInput)
  )

  const inputClass =
    "w-full rounded-xl border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#AB8A58]"
  
  const normalizedInput = normalizePersian(form.courseName)

  const courseNameSuggestions = Array.from(
    new Set(courses.map((c) => normalizePersian(c.CourseName)))
  ).filter(
    (name) =>
      normalizedInput &&
      name.includes(normalizedInput)
  )

  /* ------------------ render ------------------ */

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4" dir="rtl">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">
            ایجاد درس موقت
          </h1>

          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowRight size={18} />
            بازگشت
          </button>
        </div>

        {/* BASIC INFO */}
        <div className="bg-white rounded-2xl shadow p-6 space-y-4">
          <h2 className="font-semibold text-lg text-gray-800">
            اطلاعات پایه
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Department */}
            <select
              className={inputClass}
              value={form.department}
              onChange={(e) => {
                const dept = departments.find(
                  (d) => d.name === e.target.value
                )

                setForm({ ...form, department: e.target.value })
                setSelectedDepartment(dept ?? null)
              }}
            >
              <option value="">انتخاب دپارتمان</option>
              {departments.map((d) => (
                <option key={d.id} value={d.name}>
                  {d.name}
                </option>
              ))}
            </select>

            {/* Course Name (Autocomplete) */}
            <div className="relative">
              <input
                className={inputClass}
                placeholder="نام درس"
                value={form.courseName}
                onChange={(e) => {
                  setForm({ ...form, courseName: e.target.value })
                  setShowCourseSuggestions(true)
                }}
                onFocus={() => setShowCourseSuggestions(true)}
                onBlur={() =>
                  setTimeout(() => setShowCourseSuggestions(false), 150)
                }
              />

              {showCourseSuggestions &&
                courseNameSuggestions.length > 0 && (
                  <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow max-h-48 overflow-y-auto">
                    {courseNameSuggestions.map((name) => (
                      <div
                        key={name}
                        className="px-4 py-2 cursor-pointer hover:bg-gray-100 text-sm"
                        onClick={() => {
                          setForm({ ...form, courseName: normalizePersian(name) })
                          setShowCourseSuggestions(false)
                        }}
                      >
                        {name}
                      </div>
                    ))}
                  </div>
                )}
            </div>

            {/* Group */}
            <select
              className={inputClass}
              value={form.group}
              onChange={(e) =>
                setForm({ ...form, group: e.target.value })
              }
            >
              <option value="">گروه</option>
              {GROUPS.map((g) => (
                <option key={g}>{g}</option>
              ))}
            </select>

            {/* Units */}
            <select
              className={inputClass}
              value={form.units}
              onChange={(e) =>
                setForm({ ...form, units: e.target.value })
              }
            >
              <option value="">تعداد واحد</option>
              {UNITS.map((u) => (
                <option key={u}>{u}</option>
              ))}
            </select>

            {/* Instructor */}
            <div className="relative">
              <input
                className={inputClass}
                placeholder="نام استاد"
                value={form.instructor}
                onChange={(e) => {
                  setForm({ ...form, instructor: e.target.value })
                  setShowInstructorSuggestions(true)
                }}
                onFocus={() => setShowInstructorSuggestions(true)}
                onBlur={() =>
                  setTimeout(() => setShowInstructorSuggestions(false), 150)
                }
              />

              {showInstructorSuggestions &&
                instructorSuggestions.length > 0 && (
                  <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow max-h-48 overflow-y-auto">
                    {instructorSuggestions.map((name) => (
                      <div
                        key={name}
                        className="px-4 py-2 cursor-pointer hover:bg-gray-100 text-sm"
                        onClick={() => {
                          setForm({
                            ...form,
                            instructor: normalizePersian(name),
                          })
                          setShowInstructorSuggestions(false)
                        }}
                      >
                        {name}
                      </div>
                    ))}
                  </div>
                )}
            </div>

            {/* Target Term */}
            <select
              className={inputClass}
              value={form.targetTerm}
              onChange={(e) =>
                setForm({ ...form, targetTerm: e.target.value })
              }
            >
              <option value="">درس برای ترم</option>
              {TERMS.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        {/* FIRST CLASS */}
        <div className="bg-white rounded-2xl shadow p-6 space-y-4">
          <h2 className="font-semibold text-lg text-gray-800">
            کلاس اول
          </h2>

          <TimeDaySelector
            title="انتخاب زمان"
            value={
              form.firstDay
                ? { day: form.firstDay, time: form.firstTime }
                : null
            }
            onSelect={(day, time) =>
              setForm({ ...form, firstDay: day, firstTime: time })
            }
          />

          <input
            className={inputClass}
            placeholder="کلاس / اتاق"
            value={form.firstRoom}
            onChange={(e) =>
              setForm({ ...form, firstRoom: e.target.value })
            }
          />

          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={form.firstLock}
              onChange={(e) =>
                setForm({ ...form, firstLock: e.target.checked })
              }
              className="accent-[#AB8A58]"
            />
            قفل کردن روز و ساعت کلاس اول
          </label>
        </div>

        {/* ADD SECOND CLASS */}
        {!showSecondClass && (
          <button
            onClick={() => setShowSecondClass(true)}
            className="w-full border-2 border-dashed border-gray-300 rounded-xl py-4 text-gray-600 hover:border-[#AB8A58] hover:text-[#AB8A58] transition"
          >
            ➕ افزودن کلاس دوم
          </button>
        )}

        {/* SECOND CLASS */}
        {showSecondClass && (
          <div className="bg-white rounded-2xl shadow p-6 space-y-4">
            <h2 className="font-semibold text-lg text-gray-800">
              کلاس دوم
            </h2>

            <TimeDaySelector
              title="انتخاب زمان"
              value={
                form.secondDay
                  ? { day: form.secondDay, time: form.secondTime }
                  : null
              }
              onSelect={(day, time) =>
                setForm({
                  ...form,
                  secondDay: day,
                  secondTime: time,
                })
              }
            />

            <input
              className={inputClass}
              placeholder="کلاس / اتاق"
              value={form.secondRoom}
              onChange={(e) =>
                setForm({ ...form, secondRoom: e.target.value })
              }
            />

            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={form.secondLock}
                onChange={(e) =>
                  setForm({
                    ...form,
                    secondLock: e.target.checked,
                  })
                }
                className="accent-[#AB8A58]"
              />
              قفل کردن روز و ساعت کلاس دوم
            </label>
          </div>
        )}

        {/* FINAL EXAM */}
        <div className="bg-white rounded-2xl shadow p-6 space-y-4">
          <h2 className="font-semibold text-lg text-gray-800">
            امتحان نهایی
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="date"
              className={inputClass}
              value={form.finalExamDate}
              onChange={(e) =>
                setForm({
                  ...form,
                  finalExamDate: e.target.value,
                })
              }
            />
            <input
              type="time"
              className={inputClass}
              value={form.finalExamTime}
              onChange={(e) =>
                setForm({
                  ...form,
                  finalExamTime: e.target.value,
                })
              }
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-xl">
            {error}
          </div>
        )}

        {/* SUBMIT */}
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full bg-[#AB8A58] text-white py-3 rounded-xl font-semibold hover:opacity-90 transition"
        >
          {isLoading ? "در حال ثبت..." : "ثبت درس"}
        </button>
      </div>
    </div>
  )
}

export default CreateTempCoursePage
