import React from "react";
import { Coffee, Soup, Moon } from "lucide-react";
import { useWeeklyFoodStore } from "../../store/food/useWeeklyFoodStore";

const DaySelector: React.FC = () => {
  const { foodData, selectedDay, setSelectedDay } = useWeeklyFoodStore();
  if (!foodData) return null;

  return (
    <div className="flex overflow-x-auto gap-3 w-full max-w-3xl pb-4 mt-4">
      {foodData.meals.map((dayMeal) => (
        <button
          key={dayMeal.day}
          onClick={() => setSelectedDay(dayMeal)}
          className={`flex-shrink-0 bg-white rounded-2xl shadow-md w-36 sm:w-44 p-4 text-center border border-gray-100 hover:shadow-lg transition-all mt-1 duration-300
            ${selectedDay?.day === dayMeal.day ? "ring-2 ring-indigo-400" : ""}`}
        >
          <h2 className="text-gray-800 font-semibold text-sm mb-1">{dayMeal.day}</h2>
          <h2 className="text-gray-600 text-xs mb-2">{dayMeal.date}</h2>
          <div className="flex justify-center gap-2 text-gray-500">
            {dayMeal?.breakfast?.length ? <Coffee className="w-5 h-5 text-yellow-600" /> : null}
            {dayMeal?.lunch?.length ? <Soup className="w-5 h-5 text-green-600" /> : null}
            {dayMeal?.dinner?.length ? <Moon className="w-5 h-5 text-indigo-600" /> : null}

          </div>
        </button>
      ))}
    </div>
  );
};

export default DaySelector;
