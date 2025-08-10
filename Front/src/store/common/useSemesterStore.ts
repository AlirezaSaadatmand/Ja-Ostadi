import { create } from "zustand"
import axios from "axios"
import config from "../../config/config"
import type { Semester } from "../../types"

interface SemesterStore {
  semesters: Semester[]
  isLoading: boolean
  error: string | null
  fetchSemesters: () => Promise<void>
}

export const useSemesterStore = create<SemesterStore>((set) => ({
  semesters: [],
  isLoading: false,
  error: null,

  fetchSemesters: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await axios.get(`${config.apiUrl}/semesters`)
      const data = Array.isArray(response.data.data) ? response.data.data : []
      set({ semesters: data })
    } catch (error) {
      console.error("Error fetching semesters:", error)
      set({
        error: error instanceof Error ? error.message : String(error),
      })
    } finally {
      set({ isLoading: false })
    }
  },
}))
