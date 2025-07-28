import React from "react";
import {type Department } from "../../types";

interface DepartmentListProps {
  departments: Department[];
  selectedDept: string | null;
  onSelect: (id: string) => void;
  isLoading: boolean;
}

const DepartmentList: React.FC<DepartmentListProps> = ({
  departments,
  selectedDept,
  onSelect,
  isLoading,
}) => {
  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h2 className="text-lg font-semibold mb-2">دپارتمان‌ها</h2>
      {isLoading ? (
        <p className="text-sm text-gray-500">در حال بارگذاری...</p>
      ) : (
        <ul className="space-y-2 text-sm">
          {departments.map((dept) => (
            <li
              key={dept.id}
              className={`cursor-pointer p-2 rounded hover:bg-indigo-100 ${
                selectedDept === dept.id ? "bg-indigo-200 text-indigo-800" : ""
              }`}
              onClick={() => onSelect(dept.id)}
            >
              {dept.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DepartmentList;
