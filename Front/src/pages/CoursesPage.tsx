import type React from "react";
import { useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useCoursesPageStore } from "../store/courses/useCoursesPageStore";
import { useSemesterStore } from "../store/common/useSemesterStore";
import { useDepartmentsPageStore } from "../store/departments/useDepartmentsPageStore";
import { BookOpen, Clock, User } from "lucide-react";
import PageShell from "../components/common/PageShell";

const CoursesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    courses,
    isLoading,
    error,
    fetchCourses,
    selectedSemesterId,
    setSelectedSemesterId,
    selectedDepartmentId,
    setSelectedDepartmentId,
  } = useCoursesPageStore();

  const { semesters, fetchSemesters } = useSemesterStore();
  const { departments, fetchDepartmentsDetail } = useDepartmentsPageStore();

  useEffect(() => {
    fetchSemesters();
    fetchDepartmentsDetail();
  }, [fetchSemesters, fetchDepartmentsDetail]);

  useEffect(() => {
    const urlSemId = searchParams.get("semId");
    const urlDeptId = searchParams.get("deptId");

    if (urlSemId && !isNaN(Number(urlSemId))) {
      setSelectedSemesterId(Number(urlSemId));
    }
    if (urlDeptId && !isNaN(Number(urlDeptId))) {
      setSelectedDepartmentId(Number(urlDeptId));
    }
  }, [searchParams, setSelectedSemesterId, setSelectedDepartmentId]);

  useEffect(() => {
    if (semesters.length > 0 && selectedSemesterId === null) {
      setSelectedSemesterId(semesters[0].id);
    }
  }, [semesters, selectedSemesterId, setSelectedSemesterId]);

  useEffect(() => {
    if (departments.length > 0 && selectedDepartmentId === null) {
      setSelectedDepartmentId(departments[0].id);
    }
  }, [departments, selectedDepartmentId, setSelectedDepartmentId]);

  useEffect(() => {
    if (selectedSemesterId !== null && selectedDepartmentId !== null) {
      fetchCourses(selectedSemesterId, selectedDepartmentId);
    }
  }, [selectedSemesterId, selectedDepartmentId, fetchCourses]);

  useEffect(() => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    if (selectedSemesterId !== null) {
      newSearchParams.set("semId", selectedSemesterId.toString());
    } else {
      newSearchParams.delete("semId");
    }
    if (selectedDepartmentId !== null) {
      newSearchParams.set("deptId", selectedDepartmentId.toString());
    } else {
      newSearchParams.delete("deptId");
    }
    setSearchParams(newSearchParams, { replace: true });
  }, [selectedSemesterId, selectedDepartmentId, setSearchParams, searchParams]);

  const handleSemesterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSemId = e.target.value ? Number(e.target.value) : null;
    setSelectedSemesterId(newSemId);
  };

  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDeptId = e.target.value ? Number(e.target.value) : null;
    setSelectedDepartmentId(newDeptId);
  };


  const selectClass =
    "mt-1 block w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm shadow-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20 disabled:opacity-60";

  return (
    <PageShell title="دروس دانشگاه" subtitle="لیست دروس بر اساس ترم و دپارتمان">
      <div className="mb-8 rounded-2xl border border-white/70 bg-white/80 p-4 shadow-sm backdrop-blur animate-fade-up sm:p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="semester-filter"
              className="text-xs font-medium text-gray-700 sm:text-sm"
            >
              انتخاب ترم
            </label>
            <select
              id="semester-filter"
              className={selectClass}
              value={selectedSemesterId !== null ? selectedSemesterId : ""}
              onChange={handleSemesterChange}
              disabled={semesters.length === 0}
            >
              {semesters.length === 0 ? (
                <option value="">در حال بارگذاری ترم‌ها...</option>
              ) : (
                semesters.map((semester) => (
                  <option key={semester.id} value={semester.id}>
                    {semester.name}
                  </option>
                ))
              )}
            </select>
          </div>

          <div>
            <label
              htmlFor="department-filter"
              className="text-xs font-medium text-gray-700 sm:text-sm"
            >
              انتخاب دپارتمان
            </label>
            <select
              id="department-filter"
              className={selectClass}
              value={selectedDepartmentId !== null ? selectedDepartmentId : ""}
              onChange={handleDepartmentChange}
              disabled={departments.length === 0}
            >
              {departments.length === 0 ? (
                <option value="">در حال بارگذاری دپارتمان‌ها...</option>
              ) : (
                departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))
              )}
            </select>
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse rounded-2xl bg-white p-6 shadow-sm"
            >
              <div className="mb-4 h-6 w-3/4 rounded bg-gray-200"></div>
              <div className="h-4 w-1/2 rounded bg-gray-200"></div>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="py-12 text-center text-red-600">
          <p className="text-lg">خطا در بارگذاری دروس: {error}</p>
        </div>
      )}

      {!isLoading && !error && courses.length === 0 && (
        <div className="py-12 text-center animate-fade-in">
          <BookOpen className="mx-auto mb-4 h-20 w-20 text-gray-300" />
          <p className="text-lg text-gray-500">
            هیچ درسی با فیلترهای انتخاب شده یافت نشد.
          </p>
        </div>
      )}

      {!isLoading && !error && courses.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
          {courses.map((course, index) => (
            <Link
              key={course.id}
              to={`/courses/${course.id}`}
              style={{ animationDelay: `${Math.min(index, 12) * 50}ms` }}
              className="group flex flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 animate-fade-up hover:-translate-y-1 hover:border-brand/50 hover:shadow-xl sm:p-6"
            >
              <div className="mb-4 flex items-start gap-3">
                <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-brand/15 text-brand-dark transition-colors group-hover:bg-brand group-hover:text-white">
                  <BookOpen className="h-6 w-6" />
                </span>
                <h2 className="text-base font-semibold leading-snug text-gray-900 transition-colors group-hover:text-brand-dark sm:text-lg">
                  {course.name}
                </h2>
              </div>
              <p className="mb-3 flex items-center gap-2 text-sm text-gray-600">
                <User className="h-4 w-4 text-brand" />
                {course.instructor_name || "استاد مشخص نشده"}
              </p>
              {course.class_times && course.class_times.length > 0 && (
                <div className="mt-auto flex flex-wrap gap-1.5">
                  {course.class_times.map((ct, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 rounded-full border border-brand/20 bg-brand/10 px-2.5 py-1 text-xs text-brand-dark"
                    >
                      <Clock className="h-3.5 w-3.5" />
                      <span className="font-medium">{ct.day}</span>
                      <span className="tabular-nums">
                        {ct.start_time}-{ct.end_time}
                      </span>
                    </span>
                  ))}
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </PageShell>
  );
};

export default CoursesPage;
