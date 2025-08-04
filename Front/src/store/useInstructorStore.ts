"use client"

import { create } from "zustand"
import axios from "axios"
import config from "../config/config"
import type { InstructorListItem, InstructorDetail } from "../types"

interface InstructorStore {
  instructors: InstructorListItem[]
  instructorDetail: InstructorDetail | null
  isLoading: boolean
  isLoadingDetail: boolean
  error: string | null
  selectedDepartmentId: number | null
  selectedSemesterId: number | null

  fetchInstructors: () => Promise<void>
  fetchInstructorDetail: (id: number) => Promise<void>
  getFilteredInstructors: () => InstructorListItem[]
  setSelectedDepartmentId: (id: number | null) => void
  setSelectedSemesterId: (id: number | null) => void
}

export const useInstructorStore = create<InstructorStore>((set, get) => ({
  instructors: [],
  instructorDetail: null,
  isLoading: false,
  isLoadingDetail: false,
  error: null,
  selectedDepartmentId: null,
  selectedSemesterId: null,

  fetchInstructors: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await axios.get(`${config.apiUrl}/instructors/data`)
      const data = Array.isArray(response.data.data) ? response.data.data : []
      set({ instructors: data })
    } catch (error) {
      console.error("Error fetching instructors:", error)
      set({
        error: error instanceof Error ? error.message : String(error),
      })
    } finally {
      set({ isLoading: false })
    }
  },

  fetchInstructorDetail: async (id: number) => {
    set({ isLoadingDetail: true, error: null, instructorDetail: null })
    try {
      const response = await axios.get(`${config.apiUrl}/instructors/${id}`)
      set({ instructorDetail: response.data.data })
    } catch (error) {
      console.error(`Error fetching instructor detail for ID ${id}:`, error)
      set({
        error: error instanceof Error ? error.message : String(error),
      })
    } finally {
      set({ isLoadingDetail: false })
    }
  },

  getFilteredInstructors: () => {
    const { instructors, selectedDepartmentId, selectedSemesterId } = get()

    if (selectedDepartmentId === null || selectedSemesterId === null) {
      return []
    }

    const filtered = instructors.filter((item) => {
        
        const matchesDepartment = item.relations.department_id === selectedDepartmentId
        const matchesSemester = item.relations.semester_id === selectedSemesterId
        return matchesDepartment && matchesSemester
    })
    console.log(filtered);
    return filtered
  },

  setSelectedDepartmentId: (id: number | null) => set({ selectedDepartmentId: id }),
  setSelectedSemesterId: (id: number | null) => set({ selectedSemesterId: id }),
}))
