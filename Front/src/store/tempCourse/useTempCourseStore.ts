import { create } from "zustand"
import api from "../../utils/axios"
import config from "../../config/config"
import type { TempCourse } from "../../types"
import type { CreateTempCourseResponse } from "../../types"

interface GetTempCoursesResponse {
  status: string
  message: string
  data: CreateTempCourseResponse["data"][]
}

interface TempCourseState {
  isLoading: boolean
  error: string | null
  tempCourses: TempCourse[]

  createTempCourse: (data: TempCourse) => Promise<TempCourse | null>
  fetchTempCourses: () => Promise<void>
  clearError: () => void
}

const mapTempCourseFromApi = (
  apiCourse: CreateTempCourseResponse["data"]
): TempCourse => ({
  id: apiCourse.ID,

  department: apiCourse.Department,
  courseName: apiCourse.CourseName,
  group: apiCourse.Group,
  units: apiCourse.Units,
  instructor: apiCourse.Instructor,
  targetTerm: apiCourse.TargetTerm,

  firstRoom: apiCourse.FirstRoom,
  firstDay: apiCourse.FirstDay,
  firstTime: apiCourse.FirstTime,
  firstLock: apiCourse.FirstLock,

  secondRoom: apiCourse.SecondRoom,
  secondDay: apiCourse.SecondDay,
  secondTime: apiCourse.SecondTime,
  secondLock: apiCourse.SecondLock,

  finalExamTime: apiCourse.FinalExamTime,
  finalExamDate: apiCourse.FinalExamDate,

  directorID: apiCourse.DirectorID,
})

export const useTempCourseStore = create<TempCourseState>((set) => ({
  isLoading: false,
  error: null,
  tempCourses: [],

  clearError: () => set({ error: null }),

  createTempCourse: async (data) => {
    try {
      set({ isLoading: true, error: null })

      const res = await api.post<CreateTempCourseResponse>(
        `${config.apiUrl}/temp-courses`,
        data
      )

      const createdCourse = mapTempCourseFromApi(res.data.data)

      set((state) => ({
        tempCourses: [...state.tempCourses, createdCourse],
        isLoading: false,
      }))

      return createdCourse
    } catch (err) {
      set({
        error:
          err instanceof Error
            ? err.message
            : "خطای ناشناخته در ایجاد درس",
        isLoading: false,
      })
      return null
    }
  },

  fetchTempCourses: async () => {
    try {
      set({ isLoading: true, error: null })

      const res = await api.get<GetTempCoursesResponse>(
        `${config.apiUrl}/temp-courses`
      )

      const mappedCourses = res.data.data.map(mapTempCourseFromApi)

      set({
        tempCourses: mappedCourses,
        isLoading: false,
      })
    } catch (err) {
      set({
        error:
          err instanceof Error
            ? err.message
            : "خطای ناشناخته در دریافت دروس",
        isLoading: false,
      })
    }
  },
}))
