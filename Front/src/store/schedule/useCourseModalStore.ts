import { create } from "zustand"
import type { CourseResponse } from "../../types"

interface CourseModalStore {
  isOpen: boolean
  selectedCourse: CourseResponse | null
  isScheduledCourseInModal: boolean
  openModal: (course: CourseResponse, isScheduled: boolean) => void
  closeModal: () => void
}

export const useCourseModalStore = create<CourseModalStore>((set) => ({
  isOpen: false,
  selectedCourse: null,
  isScheduledCourseInModal: false,

  openModal: (course, isScheduled) =>
    set({
      isOpen: true,
      selectedCourse: course,
      isScheduledCourseInModal: isScheduled,
    }),
  closeModal: () =>
    set({
      isOpen: false,
      selectedCourse: null,
      isScheduledCourseInModal: false,
    }),
}))
