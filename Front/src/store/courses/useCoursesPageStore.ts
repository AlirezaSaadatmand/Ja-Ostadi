import { create } from "zustand"
import config from "../../config/config"
import type { CourseInList } from "../../types"
import api from "../../utils/axios"

interface CoursesPageStore {
  courses: CourseInList[]
  isLoading: boolean
  error: string | null
  selectedSemesterId: number | null
  selectedDepartmentId: number | null

  fetchCourses: (semesterId: number, departmentId: number) => Promise<void>
  setSelectedSemesterId: (id: number | null) => void
  setSelectedDepartmentId: (id: number | null) => void
}

export const useCoursesPageStore = create<CoursesPageStore>((set) => ({
  courses: [],
  isLoading: false,
  error: null,
  selectedSemesterId: null,
  selectedDepartmentId: null,

  fetchCourses: async (semesterId: number, departmentId: number) => {
    set({ isLoading: true, error: null, courses: [] })
    try {
      const response = await api.get(`${config.apiUrl}/courses/semester/${semesterId}/department/${departmentId}`)
      const data = Array.isArray(response.data.data) ? response.data.data : []
      set({ courses: data })
    } catch (error) {
      console.error(`Error fetching courses for semester ${semesterId} and department ${departmentId}:`, error)
      set({
        error: error instanceof Error ? error.message : String(error),
      })
    } finally {
      set({ isLoading: false })
    }
  },

  setSelectedSemesterId: (id: number | null) => set({ selectedSemesterId: id }),
  setSelectedDepartmentId: (id: number | null) => set({ selectedDepartmentId: id }),
}))
