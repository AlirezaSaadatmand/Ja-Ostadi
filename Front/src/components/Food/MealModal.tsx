import React, { useState } from "react"
import { X } from "lucide-react"
import StarRatingDisplay from "./StarRatingDisplay"
import { useMealRatingStore } from "../../store/food/useMealRatingStore"
import type { MealData } from "../../types"
import { useWeeklyFoodStore } from "../../store/food/useWeeklyFoodStore"

interface MealModalProps {
  isOpen: boolean;
  onClose: () => void;
  meal: Partial<MealData> | null;
}

const MealModal: React.FC<MealModalProps> = ({ isOpen, onClose, meal }) => {
  const [rating, setRating] = useState<number>(0)
  const [hoverRating, setHoverRating] = useState<number>(0)
  const [comment, setComment] = useState<string>("")
  const [error, setError] = useState<string>("")

  const { submitRating, isSubmitting } = useMealRatingStore()
  const { fetchWeeklyFood } = useWeeklyFoodStore()

  if (!isOpen || !meal) return null

  const handleSubmit = async () => {
    if (!rating) {
      setError("لطفاً امتیاز را انتخاب کنید.")
      return
    }

    setError("")
    await submitRating(parseInt(meal.id || ""), rating, comment)
    setRating(0)
    setComment("")
    // onClose()
    fetchWeeklyFood()
  }

  return (
    <div
      dir="rtl"
      className="fixed inset-0 flex items-center justify-center bg-black/40 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-lg w-11/12 max-w-md overflow-hidden animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h2 className="text-lg font-bold p-5 text-gray-800">{meal.name}</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {meal.imageAddress ? (
          <img
            src={meal.imageAddress}
            alt={meal.name}
            className="w-full h-48 object-cover rounded-lg"
          />
        ) : (
          <div className="w-full h-48 flex items-center justify-center bg-gray-200 text-gray-600 rounded-lg">
            عکس این غذا رو نداریم
          </div>
        )}

        <div className="p-4 text-sm text-gray-700 space-y-1">
          <p>جزئیات: {meal.description || "—"}</p>
          <p>قیمت: {meal.price ? `${meal.price} ریال` : "—"}</p>
          <p>مکان: {meal.place || "—"}</p>

          <div className="flex items-center gap-1">
            <span>امتیاز غذا:</span>

            {meal.rating && meal.rating > 0 ? (
              <>
                <StarRatingDisplay rating={meal.rating} />
                <span className="text-xs text-gray-500">
                  ({meal.rating.toFixed(1)})
                </span>
              </>
            ) : (
              <span className="text-gray-500 text-sm">هنوز کسی امتیاز نداده</span>
            )}
          </div>
        </div>

        <div className="border-t px-4 py-3">
          {!meal.commented ? (
            <>
              <p className="text-center text-gray-700 text-sm mb-2">
                امتیاز خود را انتخاب کنید:
              </p>
              <div className="flex justify-center flex-row-reverse space-x-2 space-x-reverse text-yellow-400">
                {Array(5)
                  .fill(0)
                  .map((_, i) => {
                    const index = i + 1
                    return (
                      <span
                        key={i}
                        className={`text-4xl cursor-pointer transition-colors ${
                          (hoverRating || rating) >= index
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                        onClick={() => setRating(index)}
                        onMouseEnter={() => setHoverRating(index)}
                        onMouseLeave={() => setHoverRating(0)}
                      >
                        ★
                      </span>
                    )
                  })}
              </div>

              {error && (
                <p className="text-center text-red-500 text-sm mt-1">
                  {error}
                </p>
              )}

              <textarea
                placeholder="نظر خود را بنویسید (اختیاری)"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full border rounded-lg p-2 mt-3 text-sm focus:outline-none focus:ring focus:ring-yellow-300 resize-none"
                rows={3}
              />

              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full mt-3 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg text-sm font-medium transition-all disabled:opacity-50"
              >
                {isSubmitting ? "در حال ارسال..." : "ارسال نظر"}
              </button>
            </>
          ) : (
            <p className="text-center text-green-600 font-medium py-4">
              نظر شما قبلاً ارسال شده است ✔️
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default MealModal
