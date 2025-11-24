import { create } from "zustand"
import config from "../../config/config"
import api from "../../utils/axios"
import type { RoomScheduleCourse, RoomItem } from "../../types"


interface RoomStore {
  rooms: RoomItem[]
  roomSchedule: RoomScheduleCourse[]
  isLoading: boolean
  error: string | null

  fetchRooms: () => Promise<void>
  fetchRoomSchedule: (roomId: number | string) => Promise<void>
}

export const useRoomStore = create<RoomStore>((set) => ({
  rooms: [],
  roomSchedule: [],
  isLoading: false,
  error: null,

  fetchRooms: async () => {
    set({ isLoading: true, error: null, rooms: [] })

    try {
      const response = await api.get(`${config.apiUrl}/schedule/rooms`)
      const data = Array.isArray(response.data.data)
        ? response.data.data
        : []

      set({ rooms: data })
    } catch (error) {
      console.error("Error fetching rooms:", error)
      set({
        error: error instanceof Error ? error.message : String(error),
      })
    } finally {
      set({ isLoading: false })
    }
  },

  fetchRoomSchedule: async (roomId) => {
    set({ isLoading: true, error: null, roomSchedule: [] })

    try {
      const response = await api.get(
        `${config.apiUrl}/schedule/rooms/${roomId}`
      )

      const data = Array.isArray(response.data.data)
        ? response.data.data
        : []

      set({ roomSchedule: data })
    } catch (error) {
      console.error(`Error fetching schedule for room ${roomId}:`, error)
      set({
        error: error instanceof Error ? error.message : String(error),
      })
    } finally {
      set({ isLoading: false })
    }
  },

}))