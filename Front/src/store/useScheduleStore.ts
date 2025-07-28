import { create } from "zustand";
import axios from "axios";
import config from "../config/config";
import { type Department }  from "../types";

interface DepartmentStore {
  departments: Department[];
  isLoading: boolean;
  error: string | null;

  fetchDepartments: () => Promise<void>;
}

export const useDepartmentStore = create<DepartmentStore>((set) => ({
  departments: [],
  isLoading: false,
  error: null,

  fetchDepartments: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.get(`${config.apiUrl}/departments`);
      console.log(response.data);
      
      set({ departments: response.data.data || [] });
    } catch (error) {
      console.error("Error fetching departments:", error);
      set({
        error:
          error instanceof Error ? error.message : String(error),
      });
    } finally {
      set({ isLoading: false });
    }
  },
}));
