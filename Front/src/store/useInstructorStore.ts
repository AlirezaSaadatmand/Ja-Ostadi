"use client"

import { create } from "zustand"
import axios from "axios"
import config from "../config/config"
import type { InstructorListItem, InstructorDetail, Department } from "../types" // Import Department type

interface InstructorStore {
  instructors: InstructorListItem[]
  instructorDetail: InstructorDetail | null
  isLoading: boolean
  isLoadingDetail: boolean
  error: string | null
  selectedDepartmentId: number | null
  selectedSemesterId: number | null
  filterByMode: "department" | "semester"

  fetchInstructors: () => Promise<void>
  fetchInstructorDetail: (id: number) => Promise<void>
  getFilteredInstructors: (allDepartments: Department[]) => InstructorListItem[]
  setSelectedDepartmentId: (id: number | null) => void
  setSelectedSemesterId: (id: number | null) => void
  setFilterByMode: (mode: "department" | "semester") => void
}

export const useInstructorStore = create<InstructorStore>((set, get) => ({
  instructors: [],
  instructorDetail: null,
  isLoading: false,
  isLoadingDetail: false,
  error: null,
  selectedDepartmentId: null,
  selectedSemesterId: null,
  filterByMode: "department",

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

  getFilteredInstructors: (allDepartments: Department[]) => {
    const { instructors, selectedDepartmentId, selectedSemesterId, filterByMode } = get()
    let filtered = instructors

    if (filterByMode === "semester") {
      if (selectedSemesterId !== null) {
        filtered = filtered.filter((item) => item.relations.semester_id === selectedSemesterId)
      }
      if (selectedDepartmentId !== null) {
        filtered = filtered.filter((item) => item.relations.department_id === selectedDepartmentId)
      }
    } else {
      if (selectedDepartmentId !== null) {
        const selectedDept = allDepartments.find((dept) => dept.id === selectedDepartmentId)
        if (selectedDept) {
          filtered = filtered.filter((item) => item.instructor.field === selectedDept.name)
        } else {
          filtered = []
        }
      }
      if (selectedSemesterId !== null) {
        filtered = filtered.filter((item) => item.relations.semester_id === selectedSemesterId)
      }
    }
    return filtered
  },

  setSelectedDepartmentId: (id: number | null) => set({ selectedDepartmentId: id }),
  setSelectedSemesterId: (id: number | null) => set({ selectedSemesterId: id }),
  setFilterByMode: (mode: "department" | "semester") => set({ filterByMode: mode }),
}))
