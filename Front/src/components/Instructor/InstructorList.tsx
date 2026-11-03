import type React from "react";

import { GraduationCap, BookUser } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useInstructorListStore } from "../../store/instructors/useInstructorListStore";
import type { Department, Semester } from "../../types";

interface InstructorListProps {
  departments: Department[];
  semesters: Semester[];
  query?: string;
}

const normalize = (s: string) =>
  s.replace(/ي/g, "ی").replace(/ك/g, "ک").replace(/‌/g, " ").trim();

const InstructorList: React.FC<InstructorListProps> = ({
  departments,
  semesters,
  query = "",
}) => {
  const navigate = useNavigate();
  const { isLoading, error, getFilteredInstructors } = useInstructorListStore();

  const normalizedQuery = normalize(query);
  const instructors = getFilteredInstructors(departments, semesters).filter(
    (item) =>
      !normalizedQuery ||
      normalize(item.instructor.name ?? "").includes(normalizedQuery),
  );

  const handleInstructorClick = (instructorId: number) => {
    navigate(`/instructors/${instructorId}`);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow-md p-3 sm:p-6 animate-pulse"
          >
            <div className="h-10 w-10 sm:h-16 sm:w-16 bg-gray-200 rounded-full mx-auto mb-2 sm:mb-4"></div>
            <div className="h-4 sm:h-6 bg-gray-200 rounded w-3/4 mx-auto mb-2 sm:mb-4"></div>
            <div className="h-3 sm:h-4 bg-gray-200 rounded w-1/2 mx-auto mb-1 sm:mb-2"></div>
            <div className="h-3 sm:h-4 bg-gray-200 rounded w-2/3 mx-auto"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="col-span-full text-center py-12 text-red-600">
        <p className="text-lg">خطا در بارگذاری اساتید: {error}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
      {instructors.length === 0 ? (
        <div className="col-span-full text-center py-12">
          <GraduationCap className="w-12 h-12 sm:w-20 sm:h-20 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-sm sm:text-lg">
            هیچ استادی یافت نشد.
          </p>
        </div>
      ) : (
        instructors
          .filter(
            (item) =>
              item.instructor?.name && item.instructor.name.trim() !== "",
          )
          .map((item, index) => (
            <div
              key={`${item.relations.instructor_id}-${index}`}
              onClick={() =>
                handleInstructorClick(item.relations.instructor_id)
              }
              style={{ animationDelay: `${Math.min(index, 12) * 50}ms` }}
              className="group animate-fade-up bg-white rounded-2xl shadow-sm p-3 sm:p-7 flex flex-col items-center text-center border border-gray-200 transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:shadow-xl hover:border-[#AB8A58]/50"
            >
              <div className="mb-2 sm:mb-5 flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#AB8A58] to-[#7a5f33] text-white text-lg sm:text-2xl font-bold shadow-md">
                {item.instructor.name
                  .replace(/^(دکتر|مهندس|استاد)\s+/, "")
                  .charAt(0)}
              </div>
              <h2 className="text-sm sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3 group-hover:text-[#7a5f33] transition-colors">
                {item.instructor.name}
              </h2>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#AB8A58]/10 px-3 py-1 text-xs sm:text-sm text-[#7a5f33]">
                <BookUser className="w-3.5 h-3.5" />
                {item.instructor.field}
              </span>
            </div>
          ))
      )}
    </div>
  );
};

export default InstructorList;
