"use client"

import ExcelJS from "exceljs"
import { saveAs } from "file-saver"
import type { RoomScheduleCourse } from "../../types"

const TIME_SLOTS = [
  { label: "08:00 - 10:00", start: "08:00", end: "10:00" },
  { label: "10:00 - 12:00", start: "10:00", end: "12:00" },
  { label: "12:00 - 13:30", start: "12:00", end: "13:30" },
  { label: "13:30 - 15:30", start: "13:30", end: "15:30" },
  { label: "15:30 - 17:30", start: "15:30", end: "17:30" },
  { label: "17:30 - 19:30", start: "17:30", end: "19:30" },
]

const DAYS = ["شنبه", "يک شنبه", "دو شنبه", "سه شنبه", "چهار شنبه"]

function toMinutes(time: string) {
  const [h, m] = time.split(":").map(Number)
  return h * 60 + m
}

export async function downloadRoomScheduleExcel(roomSchedule: RoomScheduleCourse[]) {
  const workbook = new ExcelJS.Workbook()
  const sheet = workbook.addWorksheet("Weekly Schedule")

  sheet.addRow(["روز / ساعت", ...TIME_SLOTS.map((s) => s.label)])

  DAYS.forEach((day) => {
    const row: string[] = [day]

    TIME_SLOTS.forEach((slot) => {
      const course = roomSchedule.find((c) =>
        c.time.some((t) => {
          if (t.day !== day) return false

          const cs = toMinutes(t.start_time)
          const ce = toMinutes(t.end_time)
          const ss = toMinutes(slot.start)
          const se = toMinutes(slot.end)

          return cs < se && ce > ss
        })
      )

      row.push(course ? `${course.courseName}\n${course.instructor}` : "")
    })

    sheet.addRow(row)
  })

  sheet.columns.forEach((col) => {
    col.width = 20
  })

  const buffer = await workbook.xlsx.writeBuffer()
  saveAs(new Blob([buffer]), "room_schedule.xlsx")
}
