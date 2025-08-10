import { create } from "zustand"
import axios from "axios"
import config from "../../config/config"
import type { InstructorListItem, Department, Semester } from "../../types"

interface InstructorListStore {
  instructors: InstructorListItem[]
  isLoading: boolean
  error: string | null
  selectedDepartmentId: number | null
  selectedSemesterId: number | null
  filterByMode: "department" | "semester"

  fetchInstructors: () => Promise<void>
  getFilteredInstructors: (allDepartments: Department[], allSemesters: Semester[]) => InstructorListItem[]
  setSelectedDepartmentId: (id: number | null) => void
  setSelectedSemesterId: (id: number | null) => void
  setFilterByMode: (mode: "department" | "semester") => void
}

export const useInstructorListStore = create<InstructorListStore>((set, get) => ({
  instructors: [],
  isLoading: false,
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

  getFilteredInstructors: (allDepartments: Department[] ) => {
    const { instructors, selectedDepartmentId, selectedSemesterId, filterByMode } = get()
    let filtered = instructors

    if (filterByMode === "semester") {
      if (selectedSemesterId !== null) {
        filtered = filtered.filter((item) => item.relations.semester_id === selectedSemesterId)
      }
      // If filtering by semester, also apply department filter if selected
      if (selectedDepartmentId !== null) {
        filtered = filtered.filter((item) => item.relations.department_id === selectedDepartmentId)
      }
    } else {
      // filterByMode === "department"
      if (selectedDepartmentId !== null) {
        const selectedDept = allDepartments.find((dept) => dept.id === selectedDepartmentId)
        if (selectedDept) {
          filtered = filtered.filter((item) => item.instructor.field === selectedDept.name)
        } else {
          filtered = [] // No matching department found, so no instructors
        }
      }
      // If filtering by department, also apply semester filter if selected
      if (selectedSemesterId !== null) {
        filtered = filtered.filter((item) => item.relations.semester_id === selectedSemesterId)
      }

      // For "department" mode, ensure unique instructors by ID
      const seenInstructorIds = new Set<number>()
      filtered = filtered.filter((item) => {
        if (seenInstructorIds.has(item.relations.instructor_id)) {
          return false
        }
        seenInstructorIds.add(item.relations.instructor_id)
        return true
      })
    }
    return filtered
  },

  setSelectedDepartmentId: (id: number | null) => set({ selectedDepartmentId: id }),
  setSelectedSemesterId: (id: number | null) => set({ selectedSemesterId: id }),
  setFilterByMode: (mode: "department" | "semester") => set({ filterByMode: mode }),
}))
