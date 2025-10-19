import React, { useState } from "react";
import { Coffee, Soup, Moon, ChevronLeft } from "lucide-react";
import { useWeeklyFoodStore } from "../../store/food/useWeeklyFoodStore";
import type { MealData } from "../../types";
import MealModal from "./MealModal";

const DayMealsSection: React.FC = () => {
  const { selectedDay } = useWeeklyFoodStore();
  const [selectedMeal, setSelectedMeal] = useState<Partial<MealData> | null>(null);

  if (!selectedDay) return null;

  const sections = [
    { title: "صبحانه", icon: <Coffee className="w-4 h-4 text-yellow-600" />, meals: selectedDay.breakfast },
    { title: "ناهار", icon: <Soup className="w-4 h-4 text-green-600" />, meals: selectedDay.lunch },
    { title: "شام", icon: <Moon className="w-4 h-4 text-indigo-600" />, meals: selectedDay.dinner },
  ];

  return (
    <>
      <div
        className="bg-white shadow-md w-full max-w-md mx-auto p-5 pt-3 border-b mt-10 border-gray-200 rounded-b-3xl"
        style={{
          height: "60vh",
          overflowY: "auto",
          position: "sticky",
          top: 0,
          zIndex: 20,
        }}
      >
        <div className="flex justify-center">
          <div className="w-16 h-1.5 bg-gray-300 rounded-full mb-3" />
        </div>

        <h2 className="font-bold text-lg text-gray-900 text-center mb-4">
          {selectedDay.day}
        </h2>

        {sections.map((section) => (
          <MealSection
            key={section.title}
            title={section.title}
            icon={section.icon}
            meals={section.meals}
            onMealClick={setSelectedMeal}
          />
        ))}
      </div>

      <MealModal
        isOpen={!!selectedMeal}
        onClose={() => setSelectedMeal(null)}
        meal={selectedMeal}
      />
    </>
  );
};

interface MealSectionProps {
  title: string;
  icon: React.ReactNode;
  meals: { name: string; price?: string; image?: string }[] | null;
  onMealClick: (meal: Partial<MealData>) => void;
}

const MealSection: React.FC<MealSectionProps> = ({
  title,
  icon,
  meals,
  onMealClick,
}) => {
  if (!meals || meals.length === 0) return null;

  return (
    <div className="mb-5 border-t pt-3">
      <div className="flex items-center space-x-2 space-x-reverse mb-2">
        {icon}
        <h3 className="font-semibold text-gray-800 text-sm">{title}</h3>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {meals.map((meal, idx) => (
          <div
            key={idx}
            className="flex justify-between items-center bg-gray-50 p-3 rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:bg-gray-100 transition"
            onClick={() => onMealClick(meal)}
          >
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700">{meal.name}</span>
            </div>
              <ChevronLeft className="w-4 h-4 text-gray-400" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DayMealsSection;
