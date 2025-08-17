import { create } from "zustand"
import axios from "axios"
import config from "../../config/config"

export interface Contributor {
  id: number
  login: string
  avatar_url: string
  html_url: string
  contributions: number
  type: string
}

interface ContributorsStore {
  contributors: Contributor[]
  isLoading: boolean
  error: string | null
  fetchContributors: () => Promise<void>
}

export const useContributorsStore = create<ContributorsStore>((set) => ({
  contributors: [],
  isLoading: false,
  error: null,

  fetchContributors: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await axios.get(
        `https://api.github.com/repos/${config.GitHubUsername}/${config.appName}/contributors`,
      )
      const data = Array.isArray(response.data) ? response.data : []
      set({ contributors: data })
    } catch (error) {
      console.error("Error fetching contributors:", error)
      set({
        error: error instanceof Error ? error.message : String(error),
      })
    } finally {
      set({ isLoading: false })
    }
  },
}))
