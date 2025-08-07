import { create } from "zustand"
import axios from "axios"
import config from "../config/config"
import type { InstructorCoursesBySemester } from "../types"

interface InstructorCoursesStore {
  instructorCoursesBySemester: InstructorCoursesBySemester[]
  isLoading: boolean
  error: string | null

  fetchInstructorCoursesBySemester: (instructorId: number) => Promise<void>
  clearInstructorCourses: () => void
}

export const useInstructorCoursesStore = create<InstructorCoursesStore>((set) => ({
  instructorCoursesBySemester: [],
  isLoading: false,
  error: null,

  fetchInstructorCoursesBySemester: async (instructorId: number) => {
    set({ isLoading: true, error: null, instructorCoursesBySemester: [] })

    try {
      const response = await axios.get(`${config.apiUrl}/instructors/courses/${instructorId}`)
      const data = Array.isArray(response.data.data) ? response.data.data : []

      set({ instructorCoursesBySemester: data })
    } catch (error) {
      console.error(`Error fetching courses for instructor ID ${instructorId}:`, error)
      set({
        error: error instanceof Error ? error.message : String(error),
      });
    } finally {
      set({ isLoading: false });
    }
  },

  clearInstructorCourses: () => {
    set({ instructorCoursesBySemester: [], error: null })
  },
}))
