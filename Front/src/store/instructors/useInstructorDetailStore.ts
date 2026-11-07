import { create } from "zustand";
import config from "../../config/config";
import type {
  InstructorDetail,
  InstructorCoursesBySemester,
} from "../../types";
import api from "../../utils/axios";

interface InstructorDetailStore {
  instructorDetail: InstructorDetail | null;
  instructorCoursesBySemester: InstructorCoursesBySemester[];
  isLoadingDetail: boolean;
  isLoadingCourses: boolean;
  detailError: string | null;
  coursesError: string | null;

  fetchInstructorDetail: (id: number) => Promise<void>;
  fetchInstructorCoursesBySemester: (instructorId: number) => Promise<void>;
  clearInstructorData: () => void;
}

export const useInstructorDetailStore = create<InstructorDetailStore>(
  (set) => ({
    instructorDetail: null,
    instructorCoursesBySemester: [],
    isLoadingDetail: false,
    isLoadingCourses: false,
    detailError: null,
    coursesError: null,

    fetchInstructorDetail: async (id: number) => {
      set({
        isLoadingDetail: true,
        detailError: null,
        instructorDetail: null,
      });
      try {
        const response = await api.get(
          `${config.apiUrl}/instructors/${id}/detail`,
        );

        set({ instructorDetail: response.data.data });
      } catch (error) {
        console.error(`Error fetching instructor detail for ID ${id}:`, error);
        set({
          detailError: error instanceof Error ? error.message : String(error),
        });
      } finally {
        set({ isLoadingDetail: false });
      }
    },

    fetchInstructorCoursesBySemester: async (instructorId: number) => {
      set({
        isLoadingCourses: true,
        coursesError: null,
        instructorCoursesBySemester: [],
      });
      try {
        const response = await api.get(
          `${config.apiUrl}/instructors/courses/${instructorId}`,
        );
        const data = Array.isArray(response.data.data)
          ? response.data.data
          : [];
        set({ instructorCoursesBySemester: data });
      } catch (error) {
        console.error(
          `Error fetching courses for instructor ID ${instructorId}:`,
          error,
        );
        set({
          coursesError: error instanceof Error ? error.message : String(error),
        });
      } finally {
        set({ isLoadingCourses: false });
      }
    },

    clearInstructorData: () => {
      set({
        instructorDetail: null,
        instructorCoursesBySemester: [],
        detailError: null,
        coursesError: null,
      });
    },
  }),
);
