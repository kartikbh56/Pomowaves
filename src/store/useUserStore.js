import { create } from "zustand";
import { getCurrentUser, logout } from "../appwrite backend/auth";
import { devtools } from "zustand/middleware";

export const useUserStore = create(
  devtools(
    (set) => ({
      user: null,
      loading: true,

      fetchCurrentUser: async () => {
        const user = await getCurrentUser();
        set(() => ({ user: user, loading: false }));
        return user;
      },

      logoutUser: async () => {
        await logout();
      },
    }),
    { name: "user store" }
  )
);
