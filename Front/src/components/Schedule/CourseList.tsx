import React from "react";

interface Course {
  id: string;
  name: string;
}

interface CourseListProps {
  courses: Course[];
}

const CourseList: React.FC<CourseListProps> = ({ courses }) => {
  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h2 className="text-lg font-semibold mb-2">دروس</h2>
      <ul className="space-y-2 text-sm">
        {courses.map((course) => (
          <li
            key={course.id}
            className="cursor-pointer p-2 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-800"
          >
            {course.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CourseList;
