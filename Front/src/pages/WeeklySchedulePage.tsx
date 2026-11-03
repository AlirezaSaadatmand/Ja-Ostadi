import type React from "react";
import { useEffect } from "react";
import { useScheduleDataStore } from "../store/schedule/useScheduleDataStore";
import {
  useScheduleTableStore,
  days,
  timeSlots,
} from "../store/schedule/useScheduleTableStore";
import { useCourseModalStore } from "../store/schedule/useCourseModalStore";
import { usePdfExportStore } from "../store/common/usePdfExportStore";

import DepartmentList from "../components/Schedule/DepartmentList";
import WeeklyTable from "../components/Schedule/WeeklyTable";
import CourseModal from "../components/Schedule/CourseModal";
import ScheduledCourseSummary from "../components/Schedule/ScheduledCourseSummary";
import CourseList from "../components/Schedule/CourseList";
import PageShell from "../components/common/PageShell";
import type { CourseResponse } from "../types";
import toast, { Toaster } from "react-hot-toast";

const WeeklySchedulePage: React.FC = () => {
  const {
    departments,
    isLoadingDepartments,
    isLoadingCourses,
    fetchDepartments,
    fetchCourses,
    selectedDept,
    setSelectedDept,
    getCoursesByDepartment,
    courses,
  } = useScheduleDataStore();

  const scheduledCourses = useScheduleTableStore(
    (state) => state.scheduledCourses,
  );
  const addCourseToSchedule = useScheduleTableStore(
    (state) => state.addCourseToSchedule,
  );
  const removeCourseFromSchedule = useScheduleTableStore(
    (state) => state.removeCourseFromSchedule,
  );
  const table = useScheduleTableStore((state) => state.table);
  const loadCoursesFromIds = useScheduleTableStore(
    (state) => state.loadCoursesFromIds,
  );
  const isLoadingTable = useScheduleTableStore((state) => state.isLoading);

  const { isExporting, exportPdf } = usePdfExportStore();

  const {
    isOpen: isModalOpen,
    selectedCourse,
    isScheduledCourseInModal,
    openModal,
    closeModal,
  } = useCourseModalStore();

  useEffect(() => {
    const oldStorageKey = "weeklySchedule";
    if (localStorage.getItem(oldStorageKey)) {
      localStorage.removeItem(oldStorageKey);
    }
  }, []);

  useEffect(() => {
    fetchDepartments();
    fetchCourses();
  }, [fetchCourses, fetchDepartments]);

  useEffect(() => {
    if (courses.length > 0 && isLoadingTable) {
      loadCoursesFromIds(courses);
    }
  }, [courses, loadCoursesFromIds, isLoadingTable]);

  const filteredCourses = selectedDept
    ? getCoursesByDepartment(selectedDept)
    : [];

  const handleCourseClick = (course: CourseResponse) => {
    const isScheduled = scheduledCourses.some(
      (c) => c.course.id === course.course.id,
    );
    openModal(course, isScheduled);
  };

  const handleAddToSchedule = (course: CourseResponse) => {
    const conflicts = addCourseToSchedule(course);

    if (conflicts.length > 0) {
      toast.error(
        `درس "${course.course.name}" با برنامه فعلی شما تداخل دارد با: ${conflicts.join(", ")}`,
      );
    } else {
      toast.success(
        `درس "${course.course.name}" با موفقیت به برنامه اضافه شد.`,
      );
    }

    closeModal();
  };

  const handleRemoveCourse = (courseId: number) => {
    const courseName =
      scheduledCourses.find((c) => c.course.id === courseId)?.course.name ||
      "درس";
    removeCourseFromSchedule(courseId);
    toast.success(`${courseName} با موفقیت از برنامه حذف شد.`);
    closeModal();
  };

  const loadFailed =
    isLoadingTable &&
    !isLoadingCourses &&
    !isLoadingDepartments &&
    courses.length === 0;

  if (loadFailed) {
    return (
      <PageShell>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-800">
              دریافت اطلاعات دروس انجام نشد
            </p>
            <p className="mt-2 text-gray-600">
              اتصال به سرور برقرار نیست. برنامه ذخیره‌شده شما حفظ شده است.
            </p>
            <button
              onClick={() => {
                fetchDepartments();
                fetchCourses();
              }}
              className="mt-5 px-5 py-2 rounded-xl bg-brand text-white font-semibold hover:bg-brand-dark transition"
            >
              تلاش مجدد
            </button>
          </div>
        </div>
      </PageShell>
    );
  }

  if (isLoadingTable) {
    return (
      <PageShell>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand mx-auto"></div>
            <p className="mt-4 text-gray-600">در حال بارگذاری برنامه...</p>
          </div>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell
      title="برنامه هفتگی دانشجو"
      subtitle="دپارتمان و درس مورد نظر خود را انتخاب کنید"
      maxWidth="max-w-6xl"
    >
      <div>
        <div className="mb-3 sm:mb-4">
          <DepartmentList
            departments={Array.isArray(departments) ? departments : []}
            selectedDept={selectedDept}
            onSelect={setSelectedDept}
            isLoading={isLoadingDepartments}
          />
        </div>
        {selectedDept && (
          <div className="mt-5 sm:mt-4 mb-5 sm:mb-4">
            <CourseList
              courses={filteredCourses}
              onCourseClick={handleCourseClick}
              isLoading={isLoadingCourses}
            />
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-1 sm:gap-4 lg:gap-6 items-stretch min-h-[500px] sm:min-h-[500px]">
          <div className="lg:w-1/4 flex-shrink-0 order-2 lg:order-1">
            <div className="lg:sticky lg:top-14">
              <ScheduledCourseSummary
                scheduledCourses={scheduledCourses}
                onCourseClick={handleCourseClick}
              />
            </div>
          </div>
          <div className="lg:w-3/4 flex-grow order-1 lg:order-2">
            <div className="bg-white/90 rounded-2xl border border-white/70 shadow-sm overflow-hidden h-full animate-fade-up">
              <WeeklyTable
                days={days}
                timeSlots={timeSlots}
                table={table}
                scheduledCourses={scheduledCourses}
                onRemoveCourse={handleRemoveCourse}
                onExportPdf={(data) => exportPdf(data)}
                isExporting={isExporting}
              />
            </div>
          </div>
        </div>
      </div>

      <CourseModal
        isOpen={isModalOpen}
        onClose={closeModal}
        course={selectedCourse}
        onAddToSchedule={handleAddToSchedule}
        onRemoveFromSchedule={handleRemoveCourse}
        isScheduledCourse={isScheduledCourseInModal}
      />

      <Toaster />
    </PageShell>
  );
};

export default WeeklySchedulePage;
