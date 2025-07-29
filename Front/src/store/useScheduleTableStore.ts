import { create } from "zustand"
import type { CourseResponse } from "../types"

export const days = ["شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنج‌شنبه", "جمعه"]

export const timeSlots = [
  { label: "8:00 - 10:00", key: "8-10", start: "08:00", end: "10:00" },
  { label: "10:00 - 12:00", key: "10-12", start: "10:00", end: "12:00" },
  { label: "14:00 - 15:45", key: "14-15_45", start: "14:00", end: "15:45" },
  { label: "15:45 - 17:30", key: "15_45-17_30", start: "15:45", end: "17:30" },
  { label: "17:30 - 19:15", key: "17_30-19_15", start: "17:30", end: "19:15" },
]

interface ScheduleTableStore {
  scheduledCourses: CourseResponse[]
  addCourseToSchedule: (course: CourseResponse) => void
  removeCourseFromSchedule: (courseId: number) => void
}

export const useScheduleTableStore = create<ScheduleTableStore>((set) => ({
  scheduledCourses: [],
  addCourseToSchedule: (course) => {
      
    set((state) => {
      console.log(state.scheduledCourses);
      const isAlreadyScheduled = state.scheduledCourses.some((c) => c.course.id === course.course.id)
      if (!isAlreadyScheduled) {
        return { scheduledCourses: [...state.scheduledCourses, course] }
      }
      return state
    })
  },
  removeCourseFromSchedule: (courseId) => {
    set((state) => ({
      scheduledCourses: state.scheduledCourses.filter((c) => c.course.id !== courseId),
    }))
  },
}))
