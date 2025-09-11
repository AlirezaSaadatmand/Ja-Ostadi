import { create } from "zustand"
import axios from "axios"
import config from "../../config/config"

interface AuthStore {
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  loginWithGoogle: (redirectTo: string) => Promise<void>
  fetchAuthStatus: () => Promise<void>
  logout: () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  isAuthenticated: false,
  isLoading: false,
  error: null,

  loginWithGoogle: async (redirectTo: string = "/") => {
    set({ isLoading: true, error: null })
    try {
      const res = await axios.get(`${config.apiUrl}/auth/google/login`, {
        params: { redirect: redirectTo },
      })
      if (res.data.status === "success" && res.data.data?.auth_url) {
        window.location.href = res.data.data.auth_url
      }
    } catch (err) {
      set({ error: err instanceof Error ? err.message : "Something went wrong" })
    } finally {
      set({ isLoading: false })
    }
  },

  fetchAuthStatus: async () => {
    set({ isLoading: true })
    try {
      const jwt = localStorage.getItem("jwt")
      if (!jwt) {
        set({ isAuthenticated: false })
        return
      }
      axios.defaults.headers.common["Authorization"] = `Bearer ${jwt}`
      const res = await axios.get(`${config.apiUrl}/auth/status`)
      set({ isAuthenticated: res.data.isAuthenticated || false })
    } catch {
      set({ isAuthenticated: false })
    } finally {
      set({ isLoading: false })
    }
  },

  logout: () => {
    localStorage.removeItem("jwt")
    delete axios.defaults.headers.common["Authorization"]
    set({ isAuthenticated: false })
  },
}))
