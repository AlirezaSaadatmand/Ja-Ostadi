import React, { useEffect, useState } from "react";
import { useDepartmentStore } from "../store/useScheduleStore";
import DepartmentList from "../components/Schedule/DepartmentList";
import CourseList from "../components/Schedule/CourseList";
import WeeklyTable from "../components/Schedule/WeeklyTable";

const fakeCourses = {
  cs: [
    { id: "cs1", name: "برنامه‌نویسی پیشرفته" },
    { id: "cs2", name: "ساختمان داده‌ها" },
  ],
  math: [
    { id: "math1", name: "ریاضی ۱" },
    { id: "math2", name: "آمار و احتمال" },
  ],
  phys: [
    { id: "phys1", name: "مکانیک" },
    { id: "phys2", name: "حرارت" },
  ],
};

const WeeklySchedulePage: React.FC = () => {
  const { departments, isLoading, fetchDepartments } = useDepartmentStore();
  const [selectedDept, setSelectedDept] = useState<string | null>(null);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const courses = selectedDept
    ? fakeCourses[selectedDept as keyof typeof fakeCourses] || []
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-4 sm:p-6 font-sans" dir="rtl">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-center text-gray-900 mb-4">
        برنامه هفتگی دانشجو
      </h1>
      <p className="text-center text-gray-600 mb-6 text-sm sm:text-base">
        دپارتمان را انتخاب کرده و از دروس موجود برای برنامه‌ریزی استفاده کنید.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <DepartmentList
            departments={Array.isArray(departments) ? departments : []}
            selectedDept={selectedDept}
            onSelect={setSelectedDept}
            isLoading={isLoading}
          />
          {selectedDept && <CourseList courses={courses} />}
        </div>

        {/* Schedule Table */}
        <div className="lg:col-span-3">
          <WeeklyTable />
        </div>
      </div>
    </div>
  );
};

export default WeeklySchedulePage;
