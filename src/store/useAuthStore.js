import { create } from "zustand";
import {
  loginWithGoogle,
  testUserLogin as loginTest,
  getCurrentUser,
  logout,
} from "../backend/auth";

export const useAuthStore = create((set) => ({
  user: null,
  isLoading: true,
  error: null,

  setUser: (user) => set({ user }),
  setLoading: () => set({ isLoading: false }),

  logout: async () => {
    await logout();
    set({ user: null, isLoading: false });
  },

  loginWithGoogle: async () => {
    await loginWithGoogle(); // OAuth redirects automatically
  },

  testUserLogin: async () => {
    await loginTest();
    const user = await getCurrentUser();
    set({ user, isLoading: false });
  },

  // Handles the OAuth2 callback with userId and secret
  handleCallback: async (userId, secret) => {
    set({ isLoading: true, error: null });
    try {
      const user = await import("../backend/auth").then((m) =>
        m.handleCallback(userId, secret),
      );
      set({ user, isLoading: false, error: null });
      return user;
    } catch (err) {
      set({ error: err.message || "Authentication failed", isLoading: false });
      throw err;
    }
  },
}));
