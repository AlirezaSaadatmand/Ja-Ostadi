import { create } from "zustand"
import config from "../../config/config"
import api from "../../utils/axios"
import type { RoomScheduleCourse, RoomItem } from "../../types"


export const TIME_SLOTS = [
  { label: "08:00 - 10:00", key: "08:00-10:00", start: "08:00", end: "10:00" },
  { label: "10:00 - 12:00", key: "10:00-12:00", start: "10:00", end: "12:00" },
  { label: "12:00 - 13:30", key: "12:00-13:30", start: "12:00", end: "13:30" },
  { label: "13:30 - 15:30", key: "13:30-15:30", start: "13:30", end: "15:30" },
  { label: "15:30 - 17:30", key: "15:30-17:30", start: "15:30", end: "17:30" },
  { label: "17:30 - 19:30", key: "17:30-19:30", start: "17:30", end: "19:30" },
]

export const DAYS = ["شنبه", "يک شنبه", "دو شنبه", "سه شنبه", "چهار شنبه"]


interface RoomStore {
  rooms: RoomItem[]
  roomSchedule: RoomScheduleCourse[]
  selectedRoom: RoomItem | null
  isLoading: boolean
  error: string | null

  fetchRooms: () => Promise<void>
  fetchRoomSchedule: (roomId: number | string) => Promise<void>

  setSelectedRoom: (room: RoomItem | null) => void
}

export const useRoomStore = create<RoomStore>((set) => ({
  rooms: [],
  roomSchedule: [],
  selectedRoom: null,
  isLoading: false,
  error: null,

  setSelectedRoom: (room) => set({ selectedRoom: room }),

  fetchRooms: async () => {
    set({ isLoading: true, error: null, rooms: [] })

    try {
      const response = await api.get(`${config.apiUrl}/schedule/rooms`)
      const data = Array.isArray(response.data.data) ? response.data.data : []

      set({ rooms: data })
    } catch (error) {
      console.error("Error fetching rooms:", error)
      set({ error: error instanceof Error ? error.message : String(error) })
    } finally {
      set({ isLoading: false })
    }
  },

fetchRoomSchedule: async (roomId) => {
  set({ isLoading: true, error: null, roomSchedule: [] })

  try {
    const response = await api.get(`${config.apiUrl}/schedule/rooms/${roomId}`)
    const data = Array.isArray(response.data.data) ? response.data.data : []

    const store = useRoomStore.getState()
    const selectedRoom = store.rooms.find(room => room.id.toString() === roomId.toString()) || null

    set({ roomSchedule: data, selectedRoom })
  } catch (error) {
    console.error(`Error fetching schedule for room ${roomId}:`, error)
    set({ error: error instanceof Error ? error.message : String(error) })
  } finally {
    set({ isLoading: false })
  }
},

}))
