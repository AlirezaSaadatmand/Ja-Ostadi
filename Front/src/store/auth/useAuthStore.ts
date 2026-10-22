import { create } from "zustand";
import axios from "axios";
import api from "../../utils/axios";
import config from "../../config/config";
import { type LoginResponse } from "../../types";

const TOKEN_KEY = "jwt";

type RegisterResult = "authenticated" | "created_needs_login";

interface AuthStatusData {
  isAuthenticated: boolean;
  username: string;
  role: string;
}

interface AuthStore {
  token: string | null;
  isAuthenticated: boolean;
  username: string | null;
  role: string | null;
  hasHydrated: boolean;

  isLoading: boolean;
  error: string | null;

  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<RegisterResult>;
  checkAuthStatus: () => Promise<boolean>;
  hydrate: () => void;
  logout: () => void;
}

function extractErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const status = err.response?.status;
    
    if (status === 409) return "این نام کاربری قبلاً ثبت شده است. لطفاً نام دیگری انتخاب کنید.";
    if (status === 401) return "نام کاربری یا رمز عبور اشتباه است.";
    if (status === 429) return "تعداد تلاش‌ها بیش از حد مجاز است. لطفاً بعداً تلاش کنید.";

    const message = (
      err.response?.data as { message?: string } | undefined
    )?.message;
    if (message) return message;

    return err.message;
  }
  if (err instanceof Error) return err.message;
  return "خطایی رخ داد";
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  token: null,
  isAuthenticated: false,
  username: null,
  role: null,
  hasHydrated: false,
  isLoading: false,
  error: null,

  hydrate: () => {
    const token = localStorage.getItem(TOKEN_KEY);
    set({
      token,
      isAuthenticated: !!token,
      hasHydrated: true,
    });
  },

  login: async (username, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post<LoginResponse>(
        `${config.apiUrl}/auth/login`,
        { username, password }
      );

      const token = res.data.data.token;
      localStorage.setItem(TOKEN_KEY, token);

      set({
        token,
        isAuthenticated: true,
        hasHydrated: true,
      });

      await get().checkAuthStatus();
    } catch (err) {
      set({ error: extractErrorMessage(err) });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (username, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post<LoginResponse>(
        `${config.apiUrl}/auth/register`,
        { username, password }
      );

      const token = (res.data?.data as { token?: string } | undefined)
        ?.token;

      if (!token) {
        return "created_needs_login";
      }

      localStorage.setItem(TOKEN_KEY, token);
      set({
        token,
        isAuthenticated: true,
        hasHydrated: true,
      });

      await get().checkAuthStatus();

      return "authenticated";
    } catch (err) {
      set({ error: extractErrorMessage(err) });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  checkAuthStatus: async () => {
    const token = get().token ?? localStorage.getItem(TOKEN_KEY);
    if (!token) {
      set({
        token: null,
        isAuthenticated: false,
        username: null,
        role: null,
      });
      return false;
    }

    try {
      const res = await api.get<{ data: AuthStatusData }>(
        `${config.apiUrl}/auth/status`
      );

      const data = res.data?.data;
      const authed = !!data?.isAuthenticated;

      if (!authed) {
        localStorage.removeItem(TOKEN_KEY);
        set({
          token: null,
          isAuthenticated: false,
          username: null,
          role: null,
        });
        return false;
      }

      set({
        isAuthenticated: true,
        username: data?.username ?? null,
        role: data?.role ?? null,
      });
      return true;
    } catch {
      localStorage.removeItem(TOKEN_KEY);
      set({
        token: null,
        isAuthenticated: false,
        username: null,
        role: null,
      });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    window.location.href = "/";
    set({
      token: null,
      isAuthenticated: false,
      username: null,
      role: null,
      hasHydrated: true,
    });
  },
}));