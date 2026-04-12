import { create } from "zustand";
import { persist } from "zustand/middleware";

type Locale = "fr" | "ar" | "en";
type Theme = "light" | "dark" | "system";

interface SettingsStore {
  locale: Locale | null;
  theme: Theme;
  hasSelectedLanguage: boolean;
  setLocale: (locale: Locale) => void;
  setTheme: (theme: Theme) => void;
  markLanguageSelected: () => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      locale: null,
      theme: "system",
      hasSelectedLanguage: false,

      setLocale: (locale) => set({ locale, hasSelectedLanguage: true }),

      setTheme: (theme) => set({ theme }),

      markLanguageSelected: () => set({ hasSelectedLanguage: true }),
    }),
    {
      name: "techshop-settings",
    }
  )
);
