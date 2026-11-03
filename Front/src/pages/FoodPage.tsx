import React, { useEffect } from "react";
import Header from "../components/Header";
import PageShell from "../components/common/PageShell";
import DaySelector from "../components/Food/DaySelector";
import DayMealsSection from "../components/Food/DayMealsSection";
import { useWeeklyFoodStore } from "../store/food/useWeeklyFoodStore";

const FoodPage: React.FC = () => {
  const { foodData, fetchWeeklyFood } = useWeeklyFoodStore();

  useEffect(() => {
    fetchWeeklyFood();
  }, [fetchWeeklyFood]);

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
    <PageShell
      title="برنامه غذایی سلف دانشگاه"
      subtitle="برای مشاهده منوی هر روز روی کارت مربوطه کلیک کنید"
    >
      <div className="flex flex-col items-center">
        <DaySelector />
        <DayMealsSection />
      </div>
    </PageShell>
  );
};

export default FoodPage;
