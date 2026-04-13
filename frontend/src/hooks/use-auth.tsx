import { create } from "zustand";
import axios from "axios";
import api from "@/lib/api";

const AUTH_API = "/auth";

interface User {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  token: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loadUser: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  loadUser: () => {
    const stored = localStorage.getItem("asw_user");
    if (stored) {
      try {
        const user = JSON.parse(stored);
        if (user && typeof user === 'object' && user.token) {
          set({ user, isAuthenticated: true });
        } else {
          localStorage.removeItem("asw_user");
        }
      } catch (e) {
        localStorage.removeItem("asw_user");
      }
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post(`${AUTH_API}/login`, { email, password });
      localStorage.setItem("asw_user", JSON.stringify(data));
      set({ user: data, isAuthenticated: true, isLoading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.error || "Login failed", isLoading: false });
      throw err;
    }
  },

  register: async (name, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post(`${AUTH_API}/register`, { name, email, password });
      localStorage.setItem("asw_user", JSON.stringify(data));
      set({ user: data, isAuthenticated: true, isLoading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.error || "Registration failed", isLoading: false });
      throw err;
    }
  },

  logout: () => {
    localStorage.removeItem("asw_user");
    delete axios.defaults.headers.common["Authorization"];
    set({ user: null, isAuthenticated: false });
  },
}));
