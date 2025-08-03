import { create } from "zustand"
import axios from "axios"
import config from "../config/config"
import type { DepartmentDetail } from "../types"

interface DepartmentDetailStore {
  departments: DepartmentDetail[]
  isLoading: boolean
  error: string | null

  fetchDepartmentsDetail: () => Promise<void>
}

export const useDepartmentDetailStore = create<DepartmentDetailStore>((set) => ({
  departments: [],
  isLoading: false,
  error: null,

  fetchDepartmentsDetail: async () => {
    set({ isLoading: true, error: null })

    try {
      const response = await axios.get(`${config.apiUrl}/departments/data`)
      const data = Array.isArray(response.data.data) ? response.data.data : []
      
      set({ departments: data })
    } catch (error) {
      console.error("Error fetching detailed departments:", error)
      set({
        error: error instanceof Error ? error.message : String(error),
      })
    } finally {
      set({ isLoading: false })
    }
  },
}))
