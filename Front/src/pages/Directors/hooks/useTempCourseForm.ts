import { useState, useEffect, useCallback } from "react"
import { useDepartmentsPageStore } from "../../../store/departments/useDepartmentsPageStore"
import { useCoursesPageStore } from "../../../store/courses/useCoursesPageStore"
import type { DepartmentDetail } from "../../../types"

export const GROUPS = ["01", "02", "03"]
export const UNITS = ["1", "2", "3", "4"]
export const TERMS = ["2", "4", "6", "8", "همه"]

export interface TempCourseForm {
  department: string
  courseName: string
  group: string
  units: string
  instructor: string
  targetTerm: string
  firstRoom: string
  firstDay: string
  firstTime: string
  firstLock: boolean
  secondRoom: string
  secondDay: string
  secondTime: string
  secondLock: boolean
  finalExamDate: string
  finalExamTime: string
}

const useTempCourseForm = () => {
  // Stores
  const { departments, fetchDepartmentsDetail } = useDepartmentsPageStore()
  const { courses, fetchCourses } = useCoursesPageStore()

  // State
  const [selectedDepartment, setSelectedDepartment] = useState<DepartmentDetail | null>(null)
  const [showSecondClass, setShowSecondClass] = useState(false)
  const [showCourseSuggestions, setShowCourseSuggestions] = useState(false)
  const [showInstructorSuggestions, setShowInstructorSuggestions] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  const [form, setForm] = useState<TempCourseForm>({
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

  // Effects
  useEffect(() => {
    fetchDepartmentsDetail()
  }, [fetchDepartmentsDetail])

  useEffect(() => {
    if (!selectedDepartment) return
    const semesterId = 65
    fetchCourses(semesterId, selectedDepartment.id)
  }, [selectedDepartment, fetchCourses])

  // Form handlers
  const handleFormChange = useCallback((updates: Partial<TempCourseForm>) => {
    setForm(prev => ({ ...prev, ...updates }))
    
    // Clear validation errors for changed fields
    const fieldNames = Object.keys(updates)
    setValidationErrors(prev => {
      const newErrors = { ...prev }
      fieldNames.forEach(field => {
        if (newErrors[field]) {
          delete newErrors[field]
        }
      })
      return newErrors
    })
  }, [])

  const handleDepartmentChange = useCallback((value: string) => {
    const dept = departments.find((d) => d.name === value) ?? null
    handleFormChange({ department: value })
    setSelectedDepartment(dept)
  }, [departments, handleFormChange])

  // Validation
  const validateForm = useCallback(() => {
    const errors: Record<string, string> = {}
    
    if (!form.department) errors.department = "لطفاً دپارتمان را انتخاب کنید."
    if (!form.courseName.trim()) errors.courseName = "لطفاً نام درس را وارد کنید."
    if (!form.group) errors.group = "لطفاً گروه را انتخاب کنید."
    if (!form.units) errors.units = "لطفاً تعداد واحد را انتخاب کنید."
    if (!form.targetTerm) errors.targetTerm = "لطفاً ترم هدف را انتخاب کنید."
    
    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }, [form])

  // Helpers
  const normalizePersian = useCallback((input: string) => {
    return input
      .trim()
      .replace(/ي/g, "ی")
      .replace(/ك/g, "ک")
      .replace(/\(کامپیوتر ج\)/g, "")
      .replace(/\(کامپیوتر\)/g, "")
      .replace(/\s+/g, " ")
      .trim()
  }, [])

  const handleSuggestionSelect = useCallback((type: 'course' | 'instructor', value: string) => {
    const normalizedValue = normalizePersian(value)
    if (type === 'course') {
      handleFormChange({ courseName: normalizedValue })
      setShowCourseSuggestions(false)
    } else {
      handleFormChange({ instructor: normalizedValue })
      setShowInstructorSuggestions(false)
    }
  }, [handleFormChange, normalizePersian])

  // Suggestions
  const normalizedInstructorInput = normalizePersian(form.instructor)
  const normalizedInput = normalizePersian(form.courseName)

  const instructorSuggestions = Array.from(
    new Set(
      courses
        .map((c) => normalizePersian(c.InstructorName))
        .filter(Boolean)
    )
  ).filter(
    (name) => normalizedInstructorInput && name.includes(normalizedInstructorInput)
  )

  const courseNameSuggestions = Array.from(
    new Set(courses.map((c) => normalizePersian(c.CourseName)))
  ).filter(
    (name) => normalizedInput && name.includes(normalizedInput)
  )

  return {
    form,
    handleFormChange,
    handleDepartmentChange,
    handleSuggestionSelect,
    validationErrors,
    showSecondClass,
    setShowSecondClass,
    departments,
    courseNameSuggestions,
    instructorSuggestions,
    showCourseSuggestions,
    setShowCourseSuggestions,
    showInstructorSuggestions,
    setShowInstructorSuggestions,
    normalizePersian,
    validateForm,
    GROUPS,
    UNITS,
    TERMS
  }
}

export default useTempCourseForm