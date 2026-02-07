import React from "react"
import type { DepartmentDetail } from "../../types"
import type { TempCourseForm } from "../../pages/Directors/hooks/useTempCourseForm"

interface BasicInfoSectionProps {
  form: TempCourseForm
  validationErrors: Record<string, string>
  departments: DepartmentDetail[]
  courseNameSuggestions: string[]
  instructorSuggestions: string[]
  showCourseSuggestions: boolean
  showInstructorSuggestions: boolean
  onDepartmentChange: (value: string) => void
  onFormChange: (updates: Partial<TempCourseForm>) => void
  onSuggestionSelect: (type: 'course' | 'instructor', value: string) => void
  onCourseSuggestionToggle: (show: boolean) => void
  onInstructorSuggestionToggle: (show: boolean) => void
  normalizePersian: (input: string) => string
  GROUPS: string[]
  UNITS: string[]
  TERMS: string[]
}

const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({
  form,
  validationErrors,
  departments,
  courseNameSuggestions,
  instructorSuggestions,
  showCourseSuggestions,
  showInstructorSuggestions,
  onDepartmentChange,
  onFormChange,
  onSuggestionSelect,
  onCourseSuggestionToggle,
  onInstructorSuggestionToggle,
  GROUPS,
  UNITS,
  TERMS
}) => {
  const inputClass = "w-full rounded-xl border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#AB8A58]"

  return (
    <div className="bg-white rounded-2xl shadow p-6 space-y-4">
      <h2 className="font-semibold text-lg text-gray-800">
        اطلاعات پایه
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Department */}
        <div>
          <select
            className={`${inputClass} ${validationErrors.department ? "border-red-500" : ""}`}
            value={form.department}
            onChange={(e) => onDepartmentChange(e.target.value)}
          >
            <option value="">انتخاب دپارتمان</option>
            {departments.map((d) => (
              <option key={d.id} value={d.name}>
                {d.name}
              </option>
            ))}
          </select>
          {validationErrors.department && (
            <p className="mt-1 text-sm text-red-600">
              {validationErrors.department}
            </p>
          )}
        </div>

        {/* Course Name */}
        <div className="relative">
          <input
            className={`${inputClass} ${validationErrors.courseName ? "border-red-500" : ""}`}
            placeholder="نام درس"
            value={form.courseName}
            onChange={(e) => onFormChange({ courseName: e.target.value })}
            onFocus={() => onCourseSuggestionToggle(true)}
            onBlur={() => setTimeout(() => onCourseSuggestionToggle(false), 150)}
          />
          {validationErrors.courseName && (
            <p className="mt-1 text-sm text-red-600">
              {validationErrors.courseName}
            </p>
          )}

          {showCourseSuggestions && courseNameSuggestions.length > 0 && (
            <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow max-h-48 overflow-y-auto">
              {courseNameSuggestions.map((name) => (
                <div
                  key={name}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100 text-sm"
                  onMouseDown={() => onSuggestionSelect('course', name)}
                >
                  {name}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Group */}
        <div>
          <select
            className={`${inputClass} ${validationErrors.group ? "border-red-500" : ""}`}
            value={form.group}
            onChange={(e) => onFormChange({ group: e.target.value })}
          >
            <option value="">گروه</option>
            {GROUPS.map((g) => (
              <option key={g}>{g}</option>
            ))}
          </select>
          {validationErrors.group && (
            <p className="mt-1 text-sm text-red-600">
              {validationErrors.group}
            </p>
          )}
        </div>

        {/* Units */}
        <div>
          <select
            className={`${inputClass} ${validationErrors.units ? "border-red-500" : ""}`}
            value={form.units}
            onChange={(e) => onFormChange({ units: e.target.value })}
          >
            <option value="">تعداد واحد</option>
            {UNITS.map((u) => (
              <option key={u}>{u}</option>
            ))}
          </select>
          {validationErrors.units && (
            <p className="mt-1 text-sm text-red-600">
              {validationErrors.units}
            </p>
          )}
        </div>

        {/* Instructor */}
        <div className="relative">
          <input
            className={inputClass}
            placeholder="نام استاد"
            value={form.instructor}
            onChange={(e) => onFormChange({ instructor: e.target.value })}
            onFocus={() => onInstructorSuggestionToggle(true)}
            onBlur={() => setTimeout(() => onInstructorSuggestionToggle(false), 150)}
          />

          {showInstructorSuggestions && instructorSuggestions.length > 0 && (
            <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow max-h-48 overflow-y-auto">
              {instructorSuggestions.map((name) => (
                <div
                  key={name}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100 text-sm"
                  onMouseDown={() => onSuggestionSelect('instructor', name)}
                >
                  {name}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Target Term */}
        <div>
          <select
            className={`${inputClass} ${validationErrors.targetTerm ? "border-red-500" : ""}`}
            value={form.targetTerm}
            onChange={(e) => onFormChange({ targetTerm: e.target.value })}
          >
            <option value="">درس برای ترم</option>
            {TERMS.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
          {validationErrors.targetTerm && (
            <p className="mt-1 text-sm text-red-600">
              {validationErrors.targetTerm}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default BasicInfoSection