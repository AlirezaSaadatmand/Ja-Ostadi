import { create } from "zustand";
import axios from "axios";
import config from "../../config/config";
import api from "../../utils/axios";

interface AdminAuthStore {
  token: string | null;
  isLoggingIn: boolean;
  error: string | null;

  login: (password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: () => boolean;
}

interface AdminLoginResponse {
  data: {
    token: string;
  };
  message: string;
}

const TOKEN_KEY = "adminToken";

export const useAdminAuthStore = create<AdminAuthStore>((set, get) => ({
  token: sessionStorage.getItem(TOKEN_KEY),
  isLoggingIn: false,
  error: null,

  login: async (password: string) => {
    set({ isLoggingIn: true, error: null });
    try {
      const response = await api.post<AdminLoginResponse>(
        `${config.apiUrl}/admin/login`,
        { password },
      );

      const token = response.data.data?.token;
      if (!token) {
        set({ error: "پاسخ سرور نامعتبر است" });
        return false;
      }

      sessionStorage.setItem(TOKEN_KEY, token);
      set({ token });
      return true;
    } catch (error: unknown) {
      set({ error: getErrorMessage(error) });
      return false;
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: () => {
    sessionStorage.removeItem(TOKEN_KEY);
    set({ token: null, error: null });
  },

  isAuthenticated: () => !!get().token,
}));

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message || error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "ورود ناموفق بود";
}