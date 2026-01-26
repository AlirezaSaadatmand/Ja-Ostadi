import { create } from "zustand"
import axios from "axios"
import api from "../../utils/axios"
import config from "../../config/config"
import toast from "react-hot-toast"
import { decodeJWT } from "../../utils/JWTDecode"
import {type AuthUser, type LoginResponse, type JwtPayload } from "../../types"


interface AuthStore {
  token: string | null
  user: AuthUser | null
  isAuthenticated: boolean
  hasHydrated: boolean

  isLoading: boolean
  error: string | null

  login: (username: string, password: string) => Promise<JwtPayload>
  loginWithGoogle: (redirectTo: string) => Promise<void>
  hydrateFromToken: () => void
  logout: () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  token: null,
  user: null,
  isAuthenticated: false,
  hasHydrated: false,
  isLoading: false,
  error: null,
  
  hydrateFromToken: () => {
    const token = localStorage.getItem("jwt")

    if (!token) {
      set({ isAuthenticated: false, user: null, hasHydrated: true })
      return
    }

    try {
      const payload = decodeJWT(token)

      if (payload.exp * 1000 < Date.now()) {
        localStorage.removeItem("jwt")
        set({ isAuthenticated: false, user: null, hasHydrated: true })
        return
      }

      set({
        token,
        user: {
          clientID: payload.clientID,
          username: payload.username,
          role: payload.role,
        },
        isAuthenticated: true,
        hasHydrated: true,
      })
    } catch {
      localStorage.removeItem("jwt")
      set({ isAuthenticated: false, user: null, hasHydrated: true })
    }
  },

  login: async (username, password) => {
    set({ isLoading: true })

    try {
      const res = await api.post<LoginResponse>(
        `${config.apiUrl}/auth/login`,
        { username, password }
      )

      const token = res.data.data.token
      localStorage.setItem("jwt", token)

      const payload = decodeJWT(token)

      set({
        token,
        user: {
          clientID: payload.clientID,
          username: payload.username,
          role: payload.role,
        },
        isAuthenticated: true,
        hasHydrated: true,
      })

      return payload
    } finally {
      set({ isLoading: false })
    }
  },

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
      const errorMessage =
        err instanceof Error ? err.message : "Something went wrong"
      set({ error: errorMessage })
      toast.error(errorMessage)
    } finally {
      set({ isLoading: false })
    }
  },

  logout: () => {
    localStorage.removeItem("jwt")
    set({
      token: null,
      user: null,
      isAuthenticated: false,
      hasHydrated: true,
    })
  },
}))
