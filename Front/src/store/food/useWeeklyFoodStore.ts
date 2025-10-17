import { create } from "zustand"
import api from "../../utils/axios"
import config from "../../config/config"
import type { FoodData, DayFoodData } from "../../types"

interface WeeklyFoodStore {
  foodData: FoodData | null
  selectedDay: DayFoodData | null
  isLoading: boolean
  error: string | null
  fetchWeeklyFood: () => Promise<void>
  setSelectedDay: (day: DayFoodData | null) => void
}

export const useWeeklyFoodStore = create<WeeklyFoodStore>((set) => ({
  foodData: null,
  selectedDay: null,
  isLoading: false,
  error: null,

  fetchWeeklyFood: async () => {
    set({ isLoading: true, error: null, foodData: null, selectedDay: null })
    try {
      const response = await api.get(`${config.apiUrl}/food/weekly`)
      const data: FoodData = response.data.data

      set({ foodData: data })

      if (data.meals.length > 0) {
        set({ selectedDay: data.meals[0] })
      }
    } catch (error) {
      console.error("Error fetching weekly food:", error)
      set({
        error: error instanceof Error ? error.message : String(error),
      })
    } finally {
      set({ isLoading: false })
    }
  },

  setSelectedDay: (day) => set({ selectedDay: day }),
}))
