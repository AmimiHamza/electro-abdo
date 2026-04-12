"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useSettingsStore } from "@/stores/settingsStore";
import { useTranslations } from "next-intl";

const languages = [
  {
    code: "fr",
    label: "Français",
    flag: "🇫🇷",
    nativeLabel: "Français",
    dir: "ltr",
  },
  {
    code: "ar",
    label: "العربية",
    flag: "🇲🇦",
    nativeLabel: "العربية",
    dir: "rtl",
  },
  {
    code: "en",
    label: "English",
    flag: "🇬🇧",
    nativeLabel: "English",
    dir: "ltr",
  },
] as const;

interface LanguageSelectorProps {
  currentLocale: string;
}

export function LanguageSelector({ currentLocale }: LanguageSelectorProps) {
  const t = useTranslations("language");
  const router = useRouter();
  const pathname = usePathname();
  const { hasSelectedLanguage, setLocale } = useSettingsStore();
  const [showModal, setShowModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !hasSelectedLanguage) {
      setShowModal(true);
    }
  }, [mounted, hasSelectedLanguage]);

  const handleSelect = (code: (typeof languages)[number]["code"]) => {
    setLocale(code);
    setShowModal(false);

    // Navigate to same page in new locale
    const segments = pathname.split("/");
    segments[1] = code;
    router.push(segments.join("/") || `/${code}`);
  };

  if (!mounted || !showModal) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-center justify-center bg-background/80 backdrop-blur-md"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", duration: 0.4 }}
          className="bg-surface rounded-2xl p-8 shadow-card-hover border border-border mx-4 w-full max-w-md"
        >
          {/* Logo / Store name */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-accent to-blue-400 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-glow">
              <span className="text-white text-2xl font-bold font-heading">T</span>
            </div>
            <h1 className="font-heading text-2xl font-bold text-foreground">
              {t("select")}
            </h1>
            <p className="text-muted-foreground text-sm mt-1">{t("subtitle")}</p>
          </div>

          {/* Language cards */}
          <div className="grid grid-cols-3 gap-3">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleSelect(lang.code)}
                className={`
                  flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all
                  hover:border-accent hover:bg-accent/5 hover:scale-105 active:scale-100
                  ${
                    currentLocale === lang.code
                      ? "border-accent bg-accent/10"
                      : "border-border bg-muted/30"
                  }
                `}
              >
                <span className="text-3xl">{lang.flag}</span>
                <span
                  className="text-sm font-semibold text-foreground"
                  dir={lang.dir}
                >
                  {lang.nativeLabel}
                </span>
              </button>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
