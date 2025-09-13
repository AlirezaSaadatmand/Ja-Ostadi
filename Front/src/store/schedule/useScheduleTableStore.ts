import { create } from "zustand"
import type { CourseResponse } from "../../types"

export const days = ["شنبه", "يک شنبه", "دو شنبه", "سه شنبه", "چهار شنبه"]

export const timeSlots = [
  { label: "8:00 - 10:00", key: "8-10", start: "08:00", end: "10:00" },
  { label: "10:00 - 12:00", key: "10-12", start: "10:00", end: "12:00" },
  { label: "13:30 - 15:30", key: "13_30-15_30", start: "13:30", end: "15:30" },
  { label: "15:30 - 17:30", key: "15_30-17_30", start: "15:30", end: "17:30" },
  { label: "17:30 - 19:30", key: "17_30-19_30", start: "17:30", end: "19:30" },
]

export interface TableCell {
  day: string
  slotKey: string
  course: CourseResponse | null
}

interface ScheduleTableStore {
  scheduledCourses: CourseResponse[]
  table: Record<string, TableCell>
  addCourseToSchedule: (course: CourseResponse) => string[]
  removeCourseFromSchedule: (courseId: number) => void
  clearSchedule: () => void
}

const STORAGE_VERSION = 2
const LOCAL_STORAGE_KEY = "weeklySchedule"

const generateEmptyTable = () => {
  const table: Record<string, TableCell> = {}
  days.forEach((day) => {
    timeSlots.forEach((slot) => {
      const key = `${day}-${slot.key}`
      table[key] = { day, slotKey: slot.key, course: null }
    })
  })
  return table
}

const findMatchingSlotKey = (start: string, end: string) => {
  const normalizedStart = start.padStart(5, "0")
  const normalizedEnd = end.padStart(5, "0")
  return timeSlots.find(
    (slot) => slot.start === normalizedStart && slot.end === normalizedEnd
  )?.key
}

const loadState = () => {
  try {
    const serializedState = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (serializedState === null) {
      return {
        version: STORAGE_VERSION,
        scheduledCourses: [],
        table: generateEmptyTable(),
      }
    }

    const state = JSON.parse(serializedState)

    if (!state.version || state.version !== STORAGE_VERSION) {
      return {
        version: STORAGE_VERSION,
        scheduledCourses: [],
        table: generateEmptyTable(),
      }
    }

    return state
  } catch (error) {
    console.error("Error loading state from localStorage:", error)
    return {
      version: STORAGE_VERSION,
      scheduledCourses: [],
      table: generateEmptyTable(),
    }
  }
}

const saveState = (state: {
  scheduledCourses: CourseResponse[]
  table: Record<string, TableCell>
  version: number
}) => {
  try {
    const serializedState = JSON.stringify({ ...state, version: STORAGE_VERSION })
    localStorage.setItem(LOCAL_STORAGE_KEY, serializedState)
  } catch (error) {
    console.error("Error saving state to localStorage:", error)
  }
}

export const useScheduleTableStore = create<ScheduleTableStore>((set, get) => ({
  ...loadState(),

  addCourseToSchedule: (course) => {
    const { scheduledCourses, table } = get()
    const conflicts: string[] = []

    for (const t of course.time) {
      const slotKey = findMatchingSlotKey(t.start_time, t.end_time)
      const key = `${t.day}-${slotKey}`

      if (!slotKey || !table[key]) {
        console.warn(
          `Could not find slot key for time: ${t.start_time}-${t.end_time} on ${t.day}`
        )
        return [`Invalid slot: ${t.day} ${t.start_time}-${t.end_time}`]
      }

      if (table[key].course) {
        conflicts.push(table[key].course.course.name)
      }
    }

    if (conflicts.length > 0) {
      console.warn(`Conflict detected with: ${conflicts.join(", ")}`)
      return conflicts
    }

    const newTable = { ...table }
    for (const t of course.time) {
      const slotKey = findMatchingSlotKey(t.start_time, t.end_time)
      if (slotKey) {
        const key = `${t.day}-${slotKey}`
        newTable[key] = { ...newTable[key], course }
      }
    }

    const newState = {
      version: STORAGE_VERSION,
      scheduledCourses: [...scheduledCourses, course],
      table: newTable,
    }

    set(newState)
    saveState(newState)
    return []
  },
  
  removeCourseFromSchedule: (courseId) => {
    const { scheduledCourses, table } = get()
    const updatedCourses = scheduledCourses.filter((c) => c.course.id !== courseId)

    const newTable = { ...table }
    Object.keys(newTable).forEach((key) => {
      if (newTable[key].course?.course.id === courseId) {
        newTable[key] = { ...newTable[key], course: null }
      }
    })

    const newState = { version: STORAGE_VERSION, scheduledCourses: updatedCourses, table: newTable }
    set(newState)
    saveState(newState)
  },

  clearSchedule: () => {
    const newState = {
      version: STORAGE_VERSION,
      scheduledCourses: [],
      table: generateEmptyTable(),
    }
    set(newState)
    saveState(newState)
  },
}))
