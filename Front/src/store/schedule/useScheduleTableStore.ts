import { create } from "zustand"
import type { CourseResponse } from "../../types"

export const days = ["شنبه", "يک شنبه", "دو شنبه", "سه شنبه", "چهار شنبه"]

export const timeSlots = [
{ label: "8:00 - 10:00", key: "8-10", start: "08:00", end: "10:00" },
{ label: "10:00 - 12:00", key: "10-12", start: "10:00", end: "12:00" },
{ label: "13:30 - 15:30", key: "13_30-15_30", start: "13:30", end: "15:30" },
{ label: "15:30 - 17:30", key: "15_30-17_30", start: "15:30", end: "17:30" },
{ label: "17:30 - 19:15", key: "17_30-19_15", start: "17:30", end: "19:15" },
]

export interface TableCell {
day: string
slotKey: string
course: CourseResponse | null
}

interface ScheduleTableStore {
  scheduledCourses: CourseResponse[]
  table: Record<string, TableCell>
  addCourseToSchedule: (course: CourseResponse) => boolean
  removeCourseFromSchedule: (courseId: number) => void
  clearSchedule: () => void
}

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
  return timeSlots.find((slot) => slot.start === normalizedStart && slot.end === normalizedEnd)?.key
}

const LOCAL_STORAGE_KEY = "weeklySchedule"


const loadState = () => {
  try {
    const serializedState = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (serializedState === null) {
      return {
        scheduledCourses: [],
        table: generateEmptyTable(),
      }
    }
    return JSON.parse(serializedState)
  } catch (error) {
    console.error("Error loading state from localStorage:", error)
    return {
      scheduledCourses: [],
      table: generateEmptyTable(),
    }
  }
}

const saveState = (state: { scheduledCourses: CourseResponse[]; table: Record<string, TableCell> }) => {
try {
  const serializedState = JSON.stringify(state)
  localStorage.setItem(LOCAL_STORAGE_KEY, serializedState)
} catch (error) {
  console.error("Error saving state to localStorage:", error)
}
}

export const useScheduleTableStore = create<ScheduleTableStore>((set, get) => ({
...loadState(),

addCourseToSchedule: (course) => {
  
  const { scheduledCourses, table } = get()
  for (const t of course.time) {
    const slotKey = findMatchingSlotKey(t.start_time, t.end_time)
    
    const key = `${t.day}-${slotKey}`
    
    if (!slotKey || !table[key]) {
      console.warn(`Could not find slot key for time: ${t.start_time}-${t.end_time} on ${t.day}`)
      return false
    }
    if (table[key].course) {
      console.warn(`Conflict detected: Slot ${key} is already occupied by ${table[key].course?.course.name}`)
      return false
    }
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
    scheduledCourses: [...scheduledCourses, course],
    table: newTable,
  }
  set(newState)
  saveState(newState)
  return true
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
  const newState = { scheduledCourses: updatedCourses, table: newTable }
  set(newState)
  saveState(newState)
},

clearSchedule: () => {
  const newState = { scheduledCourses: [], table: generateEmptyTable() }
  set(newState)
  saveState(newState)
},
}))
