import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AdminLocale } from "@/i18n/admin";

interface AdminLocaleState {
  locale: AdminLocale;
  setLocale: (locale: AdminLocale) => void;
}

export const useAdminLocaleStore = create<AdminLocaleState>()(
  persist(
    (set) => ({
      locale: "fr",
      setLocale: (locale) => set({ locale }),
    }),
    {
      name: "admin-locale",
    }
  )
);
