import { create } from "zustand"
import config from "../../config/config"
import api from "../../utils/axios"
import { AxiosError } from "axios"
import { useScheduleTableStore } from "./useScheduleTableStore"

interface ApiErrorResponse {
  data?: number[]
  message?: string
}

interface UserCoursesStore {
  isLoading: boolean
  error: string | null
  saveUserCourses: (courseIds: number[]) => Promise<void>
}

export const useUserCoursesStore = create<UserCoursesStore>((set) => ({
  isLoading: false,
  error: null,

  saveUserCourses: async (courseIds: number[]) => {
    set({ isLoading: true, error: null })

    try {
      await api.post(`${config.apiUrl}/user/courses`, { courseIds })
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>

      if (
        axiosError.response?.status === 400 &&
        Array.isArray(axiosError.response.data?.data)
      ) {
        const invalidIds = axiosError.response.data?.data ?? []
        const removeCourse = useScheduleTableStore.getState().removeCourseFromSchedule
        invalidIds.forEach((id) => removeCourse(id))

        throw new Error(`Invalid course IDs: ${invalidIds.join(", ")}`)
      }

      set({
        error:
          axiosError.response?.data?.message ??
          (axiosError.message || "Unknown error"),
      })
      throw axiosError
    } finally {
      set({ isLoading: false })
    }
  },
}))
