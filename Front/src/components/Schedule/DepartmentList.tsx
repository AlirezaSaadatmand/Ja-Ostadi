import type React from "react";
import { Building2 } from "lucide-react";
import type { Department } from "../../types";

interface DepartmentListProps {
  departments: Department[];
  selectedDept: number | null;
  onSelect: (id: number) => void;
  isLoading: boolean;
}

const DepartmentList: React.FC<DepartmentListProps> = ({
  departments,
  selectedDept,
  onSelect,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className="h-12 w-36 shrink-0 animate-pulse rounded-xl bg-slate-100"
          />
        ))}
      </div>
    );
  }

  if (departments.length === 0) {
    return (
      <div className="flex items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-sm text-slate-500">
        <Building2 className="h-5 w-5 shrink-0 text-slate-400" />
        هیچ دپارتمانی برای نمایش وجود ندارد.
      </div>
    );
  }

  return (
    <div
      className="flex snap-x snap-mandatory gap-2 overflow-x-auto pb-2 sm:gap-3"
      aria-label="فهرست دپارتمان‌ها"
    >
      {departments.map((department) => {
        const isSelected = selectedDept === department.id;

        return (
          <button
            key={department.id}
            type="button"
            aria-pressed={isSelected}
            onClick={() => onSelect(department.id)}
            className={`min-h-12 max-w-56 shrink-0 snap-start rounded-xl border px-4 py-2.5 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:px-5 ${
              isSelected
                ? "border-indigo-700 bg-indigo-700 text-white shadow-md shadow-indigo-700/15"
                : "border-slate-200 bg-white text-slate-700 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
            }`}
          >
            {department.name}
          </button>
        );
      })}
    </div>
  );
};

export default DepartmentList;
