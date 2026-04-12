"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Zap } from "lucide-react";
import { useTranslations } from "next-intl";
import { storeConfig } from "@/config/store.config";

interface Banner {
  id: string;
  image: string;
  title_fr?: string | null;
  title_ar?: string | null;
  title_en?: string | null;
  link?: string | null;
}

interface HeroCarouselProps {
  banners: Banner[];
  locale: string;
}

const AUTOPLAY_DELAY = 5000;

export function HeroCarousel({ banners, locale }: HeroCarouselProps) {
  const t = useTranslations("home");
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);

  const titleKey = `title_${locale}` as "title_fr" | "title_ar" | "title_en";

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((c) => (c - 1 + Math.max(banners.length, 1)) % Math.max(banners.length, 1));
  }, [banners.length]);

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((c) => (c + 1) % Math.max(banners.length, 1));
  }, [banners.length]);

  useEffect(() => {
    if (banners.length <= 1 || paused) return;
    const timer = setInterval(next, AUTOPLAY_DELAY);
    return () => clearInterval(timer);
  }, [banners.length, paused, next]);

  // Fallback when no banners
  if (banners.length === 0) {
    return (
      <div className="relative w-full h-[420px] md:h-[520px] lg:h-[580px] overflow-hidden bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] flex items-center">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -start-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -end-20 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        <div className="container-shop relative z-10 text-white">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-blue-400 flex items-center justify-center shadow-glow">
                <Zap className="w-5 h-5" />
              </div>
              <span className="text-accent font-semibold text-sm uppercase tracking-widest">
                {storeConfig.storeName}
              </span>
            </div>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
              {storeConfig.storeTagline[locale as "fr" | "ar" | "en"] ||
                storeConfig.storeTagline.fr}
            </h1>
            <p className="text-white/60 text-lg mb-8">
              {locale === "ar"
                ? "هواتف، شواحن، إكسسوارات وأكثر"
                : locale === "en"
                ? "Phones, chargers, accessories & more"
                : "Téléphones, chargeurs, accessoires & plus"}
            </p>
            <Link
              href={`/${locale}/offers`}
              className="btn btn-primary text-base px-8 py-3 shadow-glow"
            >
              {t("hero_cta")}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const banner = banners[current];
  const title = banner[titleKey] || banner.title_fr;

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({
      x: dir > 0 ? "-100%" : "100%",
      opacity: 0,
    }),
  };

  return (
    <div
      className="relative w-full h-[420px] md:h-[520px] lg:h-[580px] overflow-hidden bg-[#1a1a2e]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={current}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ type: "tween", duration: 0.5, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <Image
            src={banner.image}
            alt={title || storeConfig.storeName}
            fill
            className="object-cover"
            priority={current === 0}
            sizes="100vw"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent rtl:from-transparent rtl:via-black/20 rtl:to-black/60" />

          {/* Content */}
          {title && (
            <div className="absolute inset-0 flex items-center">
              <div className="container-shop text-white">
                <div className="max-w-lg">
                  <motion.h2
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="font-heading text-3xl md:text-5xl font-bold leading-tight mb-4"
                  >
                    {title}
                  </motion.h2>
                  {banner.link && (
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.35 }}
                    >
                      <Link
                        href={banner.link}
                        className="btn btn-primary text-base px-8 py-3 shadow-glow"
                      >
                        {t("hero_cta")}
                      </Link>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation arrows */}
      {banners.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute start-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm transition-all hover:scale-110"
            aria-label="Previous"
          >
            <ChevronLeft className="w-5 h-5 rtl:rotate-180" />
          </button>
          <button
            onClick={next}
            className="absolute end-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm transition-all hover:scale-110"
            aria-label="Next"
          >
            <ChevronRight className="w-5 h-5 rtl:rotate-180" />
          </button>
        </>
      )}

      {/* Dot navigation */}
      {banners.length > 1 && (
        <div className="absolute bottom-4 inset-x-0 flex justify-center gap-2 z-10">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setDirection(i > current ? 1 : -1);
                setCurrent(i);
              }}
              className={`transition-all duration-300 rounded-full ${
                i === current
                  ? "w-6 h-2 bg-white"
                  : "w-2 h-2 bg-white/50 hover:bg-white/80"
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
