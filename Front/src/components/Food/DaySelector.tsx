import React from "react"
import { Coffee, Soup, Moon } from "lucide-react"
import { useWeeklyFoodStore } from "../../store/food/useWeeklyFoodStore"

const DaySelector: React.FC = () => {
  const { foodData, selectedDay, setSelectedDay } = useWeeklyFoodStore()

  if (!foodData) return null

  return (
    <div className="flex overflow-x-auto gap-4 w-full max-w-3xl pb-4 px-1">
      {foodData.meals.map((dayMeal) => (
        <button
          key={dayMeal.day}
          onClick={() => setSelectedDay(dayMeal)}
          className={`flex-shrink-0 bg-white mt-1 rounded-2xl shadow-md w-40 sm:w-48 p-6 text-center border border-gray-100 hover:shadow-lg transition-all duration-300
            ${selectedDay?.day === dayMeal.day ? "ring-2 ring-indigo-400" : ""}`}
        >
          <h2 className="text-gray-800 font-semibold mb-2">{dayMeal.day}</h2>
          <h2 className="text-gray-800 font-semibold mb-2">{dayMeal.date}</h2>
          <div className="flex justify-center gap-2 text-gray-500">
            {dayMeal.breakfast && dayMeal.breakfast.length > 0 && <Coffee className="w-5 h-5 text-yellow-600" />}
            {dayMeal.lunch && dayMeal.lunch.length > 0 && <Soup className="w-5 h-5 text-green-600" />}
            {dayMeal.dinner && dayMeal.dinner.length > 0 && <Moon className="w-5 h-5 text-indigo-600" />}
          </div>
        </button>
      ))}
    </div>
  )
}

export default DaySelector
