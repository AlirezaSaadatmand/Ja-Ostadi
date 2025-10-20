import React, { useEffect } from "react";
import Header from "../components/Header";
import DaySelector from "../components/Food/DaySelector";
import DayMealsSection from "../components/Food/DayMealsSection";
import { useWeeklyFoodStore } from "../store/food/useWeeklyFoodStore";

const FoodPage: React.FC = () => {
  const { foodData, fetchWeeklyFood } = useWeeklyFoodStore();

  useEffect(() => {
    fetchWeeklyFood();
  }, []);

  if (!foodData) {
    return (
      <div
        dir="rtl"
        className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-white text-gray-700"
      >
        <Header />
        <p className="mt-32 text-lg font-medium text-gray-500">
          در حال بارگذاری...
        </p>
      </div>
    );
  }

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex flex-col items-center px-3 pb-32 sm:px-6 font-sans relative"
    >
      <Header />

      <div className="text-center sm:mt-20 lg:mt-30 mb-4">
        <h1 className="text-2xl sm:text-3xl mt-10 font-extrabold text-gray-900 mb-2">
          🍽️ برنامه غذایی سلف دانشگاه
        </h1>
        <p className="text-gray-600 text-sm sm:text-base">
          برای مشاهده منوی هر روز روی کارت مربوطه کلیک کنید
        </p>
      </div>

      <DaySelector />
      <DayMealsSection />
    </div>
  );
};

export default FoodPage;
