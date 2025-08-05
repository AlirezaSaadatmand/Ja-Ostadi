"use client"

import type React from "react"

interface ToggleFilterProps {
  value: "department" | "semester"
  onValueChange: (value: "department" | "semester") => void
}

const ToggleFilter: React.FC<ToggleFilterProps> = ({ value, onValueChange }) => {
  const isDepartmentActive = value === "department"
  const isSemesterActive = value === "semester"

  return (
    <div className="flex rounded-lg bg-gray-100 p-1 text-sm font-medium text-gray-700 shadow-inner" dir="rtl">
      <button
        className={`flex-1 py-2 px-4 rounded-md transition-colors duration-200 ${
          isDepartmentActive ? "bg-white shadow text-indigo-700" : "hover:bg-gray-200"
        }`}
        onClick={() => onValueChange("department")}
      >
        اساتید این رشته
      </button>
      <button
        className={`flex-1 py-2 px-4 rounded-md transition-colors duration-200 ${
          isSemesterActive ? "bg-white shadow text-indigo-700" : "hover:bg-gray-200"
        }`}
        onClick={() => onValueChange("semester")}
      >
        اساتید این ترم
      </button>
    </div>
  )
}

export default ToggleFilter
