import { create } from "zustand";
import config from "../../config/config";
import type { AdminComment, CommentStatus } from "../../types";
import api from "../../utils/axios";

interface CommentCounts {
  pending: number;
  approved: number;
  rejected: number;
}

interface AdminCommentStore {
  comments: AdminComment[];
  total: number;
  page: number;
  limit: number;
  statusFilter: CommentStatus | "";
  counts: CommentCounts;
  isLoading: boolean;
  isCountsLoading: boolean;
  error: string | null;

  fetchComments: (
    status?: CommentStatus | "",
    page?: number,
    limit?: number,
  ) => Promise<void>;
  fetchCounts: () => Promise<void>;
  updateCommentStatus: (id: number, status: CommentStatus) => Promise<boolean>;
  deleteComment: (id: number) => Promise<boolean>;
  setStatusFilter: (status: CommentStatus | "") => void;
  clearAdminComments: () => void;
}

const getAuthHeader = () => {
  const token = sessionStorage.getItem("adminToken") ?? "";
  return { headers: { "X-Admin-Token": token } };
};

export const useAdminCommentStore = create<AdminCommentStore>((set, get) => ({
  comments: [],
  total: 0,
  page: 1,
  limit: 20,
  statusFilter: "pending",
  counts: { pending: 0, approved: 0, rejected: 0 },
  isLoading: false,
  isCountsLoading: false,
  error: null,

  fetchComments: async (
    status?: CommentStatus | "",
    page?: number,
    limit?: number,
  ) => {
    const currentStatus = status !== undefined ? status : get().statusFilter;
    const currentPage = page ?? get().page;
    const currentLimit = limit ?? get().limit;

    set({
      isLoading: true,
      error: null,
      comments: [],
      statusFilter: currentStatus,
      page: currentPage,
      limit: currentLimit,
    });

    try {
      const params = new URLSearchParams();
      if (currentStatus) params.append("status", currentStatus);
      params.append("page", String(currentPage));
      params.append("limit", String(currentLimit));

      const response = await api.get(
        `${config.apiUrl}/admin/comments?${params.toString()}`,
        getAuthHeader(),
      );

      const payload = response.data.data ?? {};
      set({
        comments: Array.isArray(payload.comments) ? payload.comments : [],
        total: payload.total ?? 0,
      });
    } catch (error) {
      console.error("Error fetching admin comments:", error);
      set({
        error: error instanceof Error ? error.message : String(error),
      });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchCounts: async () => {
    set({ isCountsLoading: true });
    try {
      const baseParams = (status: CommentStatus) =>
        `status=${status}&page=1&limit=1`;

      const [pendingRes, approvedRes, rejectedRes] = await Promise.all([
        api.get(
          `${config.apiUrl}/admin/comments?${baseParams("pending")}`,
          getAuthHeader(),
        ),
        api.get(
          `${config.apiUrl}/admin/comments?${baseParams("approved")}`,
          getAuthHeader(),
        ),
        api.get(
          `${config.apiUrl}/admin/comments?${baseParams("rejected")}`,
          getAuthHeader(),
        ),
      ]);

      set({
        counts: {
          pending: pendingRes.data.data?.total ?? 0,
          approved: approvedRes.data.data?.total ?? 0,
          rejected: rejectedRes.data.data?.total ?? 0,
        },
      });
    } catch (error) {
      console.error("Error fetching comment counts:", error);
    } finally {
      set({ isCountsLoading: false });
    }
  },

  updateCommentStatus: async (id: number, status: CommentStatus) => {
    set({ error: null });
    try {
      await api.patch(
        `${config.apiUrl}/admin/comments/${id}/status`,
        { status },
        getAuthHeader(),
      );

      const { statusFilter, comments } = get();
      if (statusFilter && statusFilter !== status) {
        set({
          comments: comments.filter((c) => c.id !== id),
          total: Math.max(0, get().total - 1),
        });
      } else {
        set({
          comments: comments.map((c) => (c.id === id ? { ...c, status } : c)),
        });
      }

      get().fetchCounts();
      return true;
    } catch (error) {
      console.error(`Error updating comment ${id}:`, error);
      set({
        error: error instanceof Error ? error.message : String(error),
      });
      return false;
    }
  },

  deleteComment: async (id: number) => {
    set({ error: null });
    try {
      await api.delete(`${config.apiUrl}/admin/comments/${id}`, getAuthHeader());

      set({
        comments: get().comments.filter((c) => c.id !== id),
        total: Math.max(0, get().total - 1),
      });

      get().fetchCounts();
      return true;
    } catch (error) {
      console.error(`Error deleting comment ${id}:`, error);
      set({
        error: error instanceof Error ? error.message : String(error),
      });
      return false;
    }
  },

  setStatusFilter: (status: CommentStatus | "") => {
    set({ statusFilter: status, page: 1 });
  },

  clearAdminComments: () => {
    set({
      comments: [],
      total: 0,
      page: 1,
      error: null,
    });
  },
}));