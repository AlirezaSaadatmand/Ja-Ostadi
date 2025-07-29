import { create } from "zustand";
import axios from "axios";
import config from "../config/config";
import {type CourseResponse } from "../types";

interface CourseStore {
  courses: CourseResponse[];
  isLoading: boolean;
  error: string | null;

  fetchCourses: () => Promise<void>;
  getCoursesByDepartment: (departmentId: number) => CourseResponse[];
}

export const useCourseStore = create<CourseStore>((set, get) => ({
  courses: [],
  isLoading: false,
  error: null,

  fetchCourses: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.get(`${config.apiUrl}/schedule/data`); 
      const data = Array.isArray(response.data.data) ? response.data.data : [];
      
      set({ courses: data });
    } catch (error) {
      console.error("Error fetching courses:", error);
      set({
        error: error instanceof Error ? error.message : String(error),
      });
    } finally {
      set({ isLoading: false });
    }
  },

  getCoursesByDepartment: (departmentId: number) => {
    const { courses } = get();
    return courses.filter((c) => c.course.department_id === departmentId);
  },
}));
