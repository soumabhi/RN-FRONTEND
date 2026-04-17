import { create } from "zustand";
import api from "../services/api";

const useAppStore = create((set, get) => ({
  apps: [],
  currentApp: null,
  versions: [],
  logs: [],
  logSummary: {},
  loading: false,
  error: null,

  // ─── Apps ───────────────────────────────────────────────

  fetchApps: async () => {
    set({ loading: true });
    try {
      const { data } = await api.get("/apps");
      set({ apps: data.apps, loading: false });
    } catch (err) {
      set({
        error: err.response?.data?.error || "Failed to fetch apps",
        loading: false,
      });
    }
  },

  createApp: async (name, appId, platforms) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.post("/apps", { name, appId, platforms });
      set((s) => ({ apps: [data.app, ...s.apps], loading: false }));
      return data.app;
    } catch (err) {
      set({
        error: err.response?.data?.error || "Failed to create app",
        loading: false,
      });
      return null;
    }
  },

  fetchApp: async (id) => {
    set({ loading: true });
    try {
      const { data } = await api.get(`/apps/${id}`);
      set({ currentApp: data.app, loading: false });
    } catch (err) {
      set({
        error: err.response?.data?.error || "Failed to fetch app",
        loading: false,
      });
    }
  },

  deleteApp: async (id) => {
    try {
      await api.delete(`/apps/${id}`);
      set((s) => ({ apps: s.apps.filter((a) => a._id !== id) }));
      return true;
    } catch (err) {
      set({ error: err.response?.data?.error || "Failed to delete app" });
      return false;
    }
  },

  // ─── Versions ───────────────────────────────────────────

  fetchVersions: async (appId) => {
    set({ loading: true });
    try {
      const { data } = await api.get(`/versions/${appId}`);
      set({ versions: data.versions, loading: false });
    } catch (err) {
      set({
        error: err.response?.data?.error || "Failed to fetch versions",
        loading: false,
      });
    }
  },

  uploadVersion: async (formData) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      set({ loading: false });
      return data;
    } catch (err) {
      set({
        error: err.response?.data?.error || "Upload failed",
        loading: false,
      });
      return null;
    }
  },

  updateRollout: async (versionId, rollout) => {
    try {
      const { data } = await api.patch(`/versions/${versionId}/rollout`, {
        rollout,
      });
      set((s) => ({
        versions: s.versions.map((v) =>
          v._id === versionId ? data.version : v,
        ),
      }));
      return true;
    } catch (err) {
      set({ error: err.response?.data?.error || "Failed to update rollout" });
      return false;
    }
  },

  rollback: async (appId, platform) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.post("/rollback", { appId, platform });
      set({ loading: false });
      return data;
    } catch (err) {
      set({
        error: err.response?.data?.error || "Rollback failed",
        loading: false,
      });
      return null;
    }
  },

  // ─── Logs ───────────────────────────────────────────────

  fetchLogs: async (params = {}) => {
    set({ loading: true });
    try {
      const { data } = await api.get("/logs", { params });
      set({ logs: data.logs, logSummary: data.summary, loading: false });
    } catch (err) {
      set({
        error: err.response?.data?.error || "Failed to fetch logs",
        loading: false,
      });
    }
  },

  clearError: () => set({ error: null }),
}));

export default useAppStore;
