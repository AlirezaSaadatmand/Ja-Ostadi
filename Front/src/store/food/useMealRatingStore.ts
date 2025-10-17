import { create } from "zustand"
import api from "../../utils/axios"
import config from "../../config/config"
import toast from "react-hot-toast"

interface MealRatingStore {
  isSubmitting: boolean
  error: string | null
  submitRating: (mealId: number, rating: number, comment?: string) => Promise<void>
}

export const useMealRatingStore = create<MealRatingStore>((set) => ({
  isSubmitting: false,
  error: null,


  submitRating: async (mealId, rating, comment) => {
    set({ isSubmitting: true, error: null})

    try {
      const response = await api.post(`${config.apiUrl}/food/rate`, {
        mealId,
        rating,
        comment: comment || "",
      })

      if (response?.data.status == "success") toast.success("نظر شما ثبت شد")

    } catch (error) {
      console.error("Error submitting rating:", error)
      set({
        error: error instanceof Error ? error.message : String(error),
      })
    } finally {
      set({ isSubmitting: false })
    }
  },
}))
