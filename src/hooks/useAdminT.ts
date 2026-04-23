"use client";

import { useEffect, useState } from "react";
import { useAdminLocaleStore } from "@/stores/adminLocaleStore";
import { adminTranslations, type AdminTranslationKey } from "@/i18n/admin";

/**
 * Admin translation hook.
 * Returns a `t(key)` function for translations and the current locale.
 * Waits for Zustand localStorage rehydration before exposing the stored value.
 */
export function useAdminT() {
  const locale = useAdminLocaleStore((s) => s.locale);
  const setLocale = useAdminLocaleStore((s) => s.setLocale);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Until hydrated, fall back to "fr" so SSR output matches first client render.
  const active = mounted ? locale : "fr";
  const dict = adminTranslations[active];

  const t = (key: AdminTranslationKey) => dict[key] ?? key;

  return { t, locale: active, setLocale, mounted };
}
