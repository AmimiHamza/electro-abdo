"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AnnouncementData {
  id: string;
  text_fr: string;
  text_ar: string;
  text_en: string;
  bgColor: string;
}

interface AnnouncementBarProps {
  announcement: AnnouncementData;
  locale: string;
}

export function AnnouncementBar({ announcement, locale }: AnnouncementBarProps) {
  const [dismissed, setDismissed] = useState(false);
  const [mounted, setMounted] = useState(false);

  const storageKey = `announcement_dismissed_${announcement.id}`;

  useEffect(() => {
    setMounted(true);
    if (localStorage.getItem(storageKey)) {
      setDismissed(true);
    }
  }, [storageKey]);

  const dismiss = () => {
    setDismissed(true);
    localStorage.setItem(storageKey, "1");
  };

  const text =
    locale === "ar"
      ? announcement.text_ar
      : locale === "en"
      ? announcement.text_en
      : announcement.text_fr;

  if (!mounted || dismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.3 }}
        style={{ backgroundColor: announcement.bgColor }}
        className="relative text-white text-xs sm:text-sm font-medium text-center px-8 py-2 overflow-hidden"
      >
        <span>{text}</span>
        <button
          onClick={dismiss}
          className="absolute top-1/2 -translate-y-1/2 end-3 w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
          aria-label="Dismiss announcement"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
