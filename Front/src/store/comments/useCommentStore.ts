import { create } from "zustand";
import config from "../../config/config";
import type { Comment } from "../../types";
import api from "../../utils/axios";

interface CommentStore {
  comments: Comment[];
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  successMessage: string | null;

  fetchComments: (instructorId: number) => Promise<void>;
  submitComment: (instructorId: number, content: string) => Promise<boolean>;
  clearComments: () => void;
}

export const useCommentStore = create<CommentStore>((set) => ({
  comments: [],
  isLoading: false,
  isSubmitting: false,
  error: null,
  successMessage: null,

  fetchComments: async (instructorId: number) => {
    set({ isLoading: true, error: null, comments: [] });
    try {
      const response = await api.get(
        `${config.apiUrl}/comments/instructor/${instructorId}`,
      );
      const data = Array.isArray(response.data.data) ? response.data.data : [];
      set({ comments: data });
    } catch (error) {
      console.error(
        `Error fetching comments for instructor ID ${instructorId}:`,
        error,
      );
      set({
        error: error instanceof Error ? error.message : String(error),
      });
    } finally {
      set({ isLoading: false });
    }
  },

  submitComment: async (instructorId: number, content: string) => {
    set({ isSubmitting: true, error: null, successMessage: null });
    try {
      const response = await api.post(`${config.apiUrl}/comments`, {
        instructor_id: instructorId,
        content,
      });
      set({
        successMessage:
          response.data.message || "نظر شما ثبت شد و در انتظار تایید است",
      });
      return true;
    } catch (error) {
      console.error("Error submitting comment:", error);
      set({
        error: error instanceof Error ? error.message : String(error),
      });
      return false;
    } finally {
      set({ isSubmitting: false });
    }
  },

  clearComments: () => {
    set({
      comments: [],
      error: null,
      successMessage: null,
    });
  },
}));