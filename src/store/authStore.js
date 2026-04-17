import { create } from "zustand";
import api from "../services/api";

const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem("token"),
  loading: false,
  error: null,

  // Register new user
  register: async (name, email, password) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.post("/auth/register", {
        name,
        email,
        password,
      });
      localStorage.setItem("token", data.token);
      set({ user: data.user, token: data.token, loading: false });
      return true;
    } catch (err) {
      set({
        error: err.response?.data?.error || "Registration failed",
        loading: false,
      });
      return false;
    }
  },

  // Login
  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", data.token);
      set({ user: data.user, token: data.token, loading: false });
      return true;
    } catch (err) {
      set({
        error: err.response?.data?.error || "Login failed",
        loading: false,
      });
      return false;
    }
  },

  // Get current user
  fetchUser: async () => {
    try {
      const { data } = await api.get("/auth/me");
      set({ user: data.user });
    } catch {
      set({ user: null, token: null });
      localStorage.removeItem("token");
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem("token");
    set({ user: null, token: null });
  },

  clearError: () => set({ error: null }),
}));

export default useAuthStore;
