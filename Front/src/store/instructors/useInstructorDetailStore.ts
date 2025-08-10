import { create } from "zustand"
import axios from "axios"
import config from "../../config/config"
import type { InstructorDetail, InstructorCoursesBySemester } from "../../types"

interface InstructorDetailStore {
  instructorDetail: InstructorDetail | null
  instructorCoursesBySemester: InstructorCoursesBySemester[]
  isLoading: boolean
  error: string | null

  fetchInstructorDetail: (id: number) => Promise<void>
  fetchInstructorCoursesBySemester: (instructorId: number) => Promise<void>
  clearInstructorData: () => void
}

export const useInstructorDetailStore = create<InstructorDetailStore>((set) => ({
  instructorDetail: null,
  instructorCoursesBySemester: [],
  isLoading: false,
  error: null,

  fetchInstructorDetail: async (id: number) => {
    set({ isLoading: true, error: null, instructorDetail: null })
    try {
      const response = await axios.get(`${config.apiUrl}/instructors/${id}/detail`)
      console.log(response.data.data);
      
      set({ instructorDetail: response.data.data })
    } catch (error) {
      console.error(`Error fetching instructor detail for ID ${id}:`, error)
      set({
        error: error instanceof Error ? error.message : String(error),
      })
    } finally {
      set({ isLoading: false })
    }
  },

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
      })
    } finally {
      set({ isLoading: false })
    }
  },

  clearInstructorData: () => {
    set({ instructorDetail: null, instructorCoursesBySemester: [], error: null })
  },
}))
