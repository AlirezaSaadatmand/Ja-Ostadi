import { create } from "zustand";
import config from "../../config/config";
import type { Comment, MyComment } from "../../types";
import api from "../../utils/axios";
import { useAuthStore } from "../auth/useAuthStore";

interface CommentStore {
  comments: Comment[];
  myComments: MyComment[];
  isLoading: boolean;
  isMyCommentsLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  successMessage: string | null;

  fetchComments: (instructorId: number) => Promise<void>;
  fetchMyComments: () => Promise<void>;
  submitComment: (instructorId: number, content: string) => Promise<boolean>;
  resetSubmitStatus: () => void;
  clearComments: () => void;
  clearMyComments: () => void;
}

const getAuthHeader = () => {
  const token = useAuthStore.getState().token ?? "";
  return { headers: { Authorization: `Bearer ${token}` } };
};

export const useCommentStore = create<CommentStore>((set) => ({
  comments: [],
  myComments: [],
  isLoading: false,
  isMyCommentsLoading: false,
  isSubmitting: false,
  error: null,
  successMessage: null,

  fetchComments: async (instructorId: number) => {
    set({ isLoading: true, error: null, comments: [] });
    try {
      const response = await api.get(
        `${config.apiUrl}/comments/instructor/${instructorId}`,
        getAuthHeader(),
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

  fetchMyComments: async () => {
    set({ isMyCommentsLoading: true, error: null, myComments: [] });
    try {
      const response = await api.get(
        `${config.apiUrl}/comments/me`,
        getAuthHeader(),
      );
      const data = Array.isArray(response.data.data) ? response.data.data : [];
      set({ myComments: data });
    } catch (error) {
      console.error("Error fetching my comments:", error);
      set({
        error: error instanceof Error ? error.message : String(error),
      });
    } finally {
      set({ isMyCommentsLoading: false });
    }
  },

  submitComment: async (instructorId: number, content: string) => {
    set({ isSubmitting: true, error: null, successMessage: null });
    try {
      await api.post(
        `${config.apiUrl}/comments`,
        {
          instructor_id: instructorId,
          content,
        },
        getAuthHeader(),
      );
      set({
        successMessage:
          "نظر شما با موفقیت ثبت شد و پس از تایید مدیر، در این صفحه نمایش داده خواهد شد.",
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

  resetSubmitStatus: () => {
    set({ error: null, successMessage: null });
  },

  clearComments: () => {
    set({
      comments: [],
      error: null,
      successMessage: null,
    });
  },

  clearMyComments: () => {
    set({
      myComments: [],
      error: null,
    });
  },
}));