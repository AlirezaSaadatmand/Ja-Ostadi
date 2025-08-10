import { create } from "zustand"
import axios from "axios"
import config from "../../config/config"
import type { Department, CourseResponse } from "../../types"

interface ScheduleDataStore {
  departments: Department[]
  courses: CourseResponse[]
  isLoadingDepartments: boolean
  isLoadingCourses: boolean
  error: string | null
  selectedDept: number | null

  fetchDepartments: () => Promise<void>
  setSelectedDept: (id: number | null) => void
  fetchCourses: () => Promise<void>
  getCoursesByDepartment: (departmentId: number) => CourseResponse[]
}

export const useScheduleDataStore = create<ScheduleDataStore>((set, get) => ({
  departments: [],
  courses: [],
  isLoadingDepartments: false,
  isLoadingCourses: false,
  error: null,
  selectedDept: null,

  fetchDepartments: async () => {
    set({ isLoadingDepartments: true, error: null })
    try {
      const response = await axios.get(`${config.apiUrl}/departments`)
      const data = Array.isArray(response.data.data) ? response.data.data : []
      set({ departments: data })
      if (data.length > 0 && get().selectedDept === null) {
        set({ selectedDept: data[0].id })
      }
    } catch (error) {
      console.error("Error fetching departments for schedule:", error)
      set({
        error: error instanceof Error ? error.message : String(error),
      })
    } finally {
      set({ isLoadingDepartments: false })
    }
  },

  setSelectedDept: (id) => set({ selectedDept: id }),

  fetchCourses: async () => {
    set({ isLoadingCourses: true, error: null })
    try {
      const response = await axios.get(`${config.apiUrl}/schedule/data`)
      const data = Array.isArray(response.data.data) ? response.data.data : []
      set({ courses: data })
    } catch (error) {
      console.error("Error fetching courses for schedule:", error)
      set({
        error: error instanceof Error ? error.message : String(error),
      })
    } finally {
      set({ isLoadingCourses: false })
    }
  },

  getCoursesByDepartment: (departmentId: number) => {
    const { courses } = get()
    return courses.filter((c) => c.course.department_id === departmentId)
  },
}))
