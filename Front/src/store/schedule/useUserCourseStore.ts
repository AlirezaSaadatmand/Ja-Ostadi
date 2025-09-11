import { create } from "zustand"
import config from "../../config/config"
import api from "../../utils/axios"

interface UserCoursesStore {
  isLoading: boolean
  error: string | null
  saveUserCourses: (courseIds: number[]) => Promise<void>
}

export const useUserCoursesStore = create<UserCoursesStore>((set) => ({
  isLoading: false,
  error: null,

  saveUserCourses: async (courseIds) => {
    set({ isLoading: true, error: null })
    try {

        await api.post(
            `${config.apiUrl}/user/courses`,
            { courseIds },
        )
      
    } catch (err) {
      console.error("Error saving user courses:", err)
      set({ error: err instanceof Error ? err.message : String(err) })
    } finally {
      set({ isLoading: false })
    }
  },
}))
