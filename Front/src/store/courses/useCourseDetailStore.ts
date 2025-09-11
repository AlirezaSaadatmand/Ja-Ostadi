import { create } from "zustand"
import config from "../../config/config"
import type { CourseDetailResponseData } from "../../types"
import api from "../../utils/axios"

interface CourseDetailStore {
  courseDetail: CourseDetailResponseData | null
  isLoading: boolean
  error: string | null
  fetchCourseDetail: (id: number) => Promise<void>
  clearCourseDetail: () => void
}

export const useCourseDetailStore = create<CourseDetailStore>((set) => ({
  courseDetail: null,
  isLoading: false,
  error: null,

  fetchCourseDetail: async (id: number) => {
    set({ isLoading: true, error: null, courseDetail: null })
    try {
      const response = await api.get(`${config.apiUrl}/courses/${id}/detail`)
      set({ courseDetail: response.data.data })
    } catch (error) {
      console.error(`Error fetching course detail for ID ${id}:`, error)
      set({
        error: error instanceof Error ? error.message : String(error),
      })
    } finally {
      set({ isLoading: false })
    }
  },

  clearCourseDetail: () => {
    set({ courseDetail: null, error: null })
  },
}))
