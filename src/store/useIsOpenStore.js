import { create } from "zustand";

export const useIsOpenStore = create((set) => ({
  settings: false,
  reports: false,
  toggleMenu: (menu) => {
    set((state) => ({ [menu]: !state[menu] }));
  },
}));
