import type React from "react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import { useInstructorListStore } from "../store/instructors/useInstructorListStore";
import { useDepartmentsPageStore } from "../store/departments/useDepartmentsPageStore";
import { useSemesterStore } from "../store/common/useSemesterStore";
import InstructorList from "../components/Instructor/InstructorList";
import ToggleFilter from "../components/common/ToggleFilter";
import PageShell from "../components/common/PageShell";

const InstructorsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [nameQuery, setNameQuery] = useState("");

  const {
    fetchInstructors,
    selectedDepartmentId,
    setSelectedDepartmentId,
    selectedSemesterId,
    setSelectedSemesterId,
    filterByMode,
    setFilterByMode,
  } = useInstructorListStore();
  const { departments, fetchDepartmentsDetail } = useDepartmentsPageStore();
  const { semesters, fetchSemesters } = useSemesterStore();

  useEffect(() => {
    fetchInstructors();
    fetchDepartmentsDetail();
    fetchSemesters();
  }, [fetchInstructors, fetchDepartmentsDetail, fetchSemesters]);

  useEffect(() => {
    const urlDeptId = searchParams.get("deptId");
    const urlSemId = searchParams.get("semId");
    const urlMode = searchParams.get("mode") as
      "department" | "semester" | null;

    if (urlDeptId && !isNaN(Number(urlDeptId))) {
      setSelectedDepartmentId(Number(urlDeptId));
    }
    if (urlSemId && !isNaN(Number(urlSemId))) {
      setSelectedSemesterId(Number(urlSemId));
    }
    if (urlMode && (urlMode === "department" || urlMode === "semester")) {
      setFilterByMode(urlMode);
    }
  }, [
    searchParams,
    setSelectedDepartmentId,
    setSelectedSemesterId,
    setFilterByMode,
  ]);

  useEffect(() => {
    if (departments.length > 0 && selectedDepartmentId === null) {
      setSelectedDepartmentId(departments[0].id);
    }
  }, [departments, selectedDepartmentId, setSelectedDepartmentId]);

  useEffect(() => {
    if (semesters.length > 0 && selectedSemesterId === null) {
      setSelectedSemesterId(semesters[0].id);
    }
  }, [semesters, selectedSemesterId, setSelectedSemesterId]);

  useEffect(() => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    if (selectedDepartmentId !== null) {
      newSearchParams.set("deptId", selectedDepartmentId.toString());
    } else {
      newSearchParams.delete("deptId");
    }
    if (selectedSemesterId !== null) {
      newSearchParams.set("semId", selectedSemesterId.toString());
    } else {
      newSearchParams.delete("semId");
    }
    newSearchParams.set("mode", filterByMode);
    setSearchParams(newSearchParams, { replace: true });
  }, [
    selectedDepartmentId,
    selectedSemesterId,
    filterByMode,
    setSearchParams,
    searchParams,
  ]);

  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDeptId = e.target.value ? Number(e.target.value) : null;
    setSelectedDepartmentId(newDeptId);
  };

  const handleSemesterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSemId = e.target.value ? Number(e.target.value) : null;
    setSelectedSemesterId(newSemId);
  };

  const handleFilterModeChange = (mode: "department" | "semester") => {
    setFilterByMode(mode);
  };

  return (
    <PageShell title="اساتید دانشگاه" subtitle="لیست اساتید و جزئیات تماس آنها">
      <div>
        <div className="mb-8 rounded-2xl border border-white/70 bg-white/80 p-4 shadow-sm backdrop-blur animate-fade-up sm:p-8">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 justify-center items-center">
            <div className="w-full sm:w-1/2 lg:w-1/3">
              <label
                htmlFor="department-filter"
                className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2"
              >
                فیلتر بر اساس دپارتمان:
              </label>
              <select
                id="department-filter"
                className="mt-1 block w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm shadow-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                value={
                  selectedDepartmentId !== null ? selectedDepartmentId : ""
                }
                onChange={handleDepartmentChange}
              >
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-full sm:w-1/2 lg:w-1/3">
              <label
                htmlFor="semester-filter"
                className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2"
              >
                فیلتر بر اساس ترم:
              </label>
              <select
                id="semester-filter"
                className="mt-1 block w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm shadow-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                value={selectedSemesterId !== null ? selectedSemesterId : ""}
                onChange={handleSemesterChange}
              >
                {semesters.map((semester) => (
                  <option key={semester.id} value={semester.id}>
                    {semester.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-full sm:w-auto flex items-center justify-center mt-2 sm:mt-4">
              <ToggleFilter
                value={filterByMode}
                onValueChange={handleFilterModeChange}
              />
            </div>
          </div>
        </div>
        <div className="relative mb-6">
          <Search className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            value={nameQuery}
            onChange={(e) => setNameQuery(e.target.value)}
            placeholder="جستجوی نام استاد در این لیست..."
            className="w-full rounded-xl border border-gray-200 bg-white py-3 pr-12 pl-4 text-sm shadow-sm outline-none focus:border-[#AB8A58] focus:ring-2 focus:ring-[#AB8A58]/20"
          />
        </div>
        <InstructorList
          departments={departments}
          semesters={semesters}
          query={nameQuery}
        />
      </div>
    </PageShell>
  );
};

export default InstructorsPage;
