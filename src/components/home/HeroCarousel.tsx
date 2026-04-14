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
          <div className="absolute -top-20 -start-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" />
          <div className="absolute -bottom-20 -end-20 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-float-delayed" />
          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
          {/* Floating particles */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 bg-accent/30 rounded-full"
              style={{ left: `${15 + i * 18}%`, top: `${20 + (i % 3) * 25}%` }}
              animate={{ y: [0, -20, 0], opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 3 + i, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}
        </div>

        <div className="container-shop relative z-10 text-white">
          <div className="max-w-xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-2 mb-4"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-blue-400 flex items-center justify-center animate-glow-pulse">
                <Zap className="w-5 h-5" />
              </div>
              <span className="text-accent font-semibold text-sm uppercase tracking-widest">
                {storeConfig.storeName}
              </span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4"
            >
              {storeConfig.storeTagline[locale as "fr" | "ar" | "en"] ||
                storeConfig.storeTagline.fr}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-white/60 text-lg mb-8"
            >
              {locale === "ar"
                ? "هواتف، شواحن، إكسسوارات وأكثر"
                : locale === "en"
                ? "Phones, chargers, accessories & more"
                : "Téléphones, chargeurs, accessoires & plus"}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
            >
              <Link
                href={`/${locale}/offers`}
                className="btn btn-primary text-base px-8 py-3 animate-glow-pulse"
              >
                {t("hero_cta")}
              </Link>
            </motion.div>
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
          transition={{ type: "tween", duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="absolute inset-0"
        >
          {/* Ken Burns zoom effect on image */}
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 1.0 }}
            animate={{ scale: 1.08 }}
            transition={{ duration: 7, ease: "linear" }}
          >
            <Image
              src={banner.image}
              alt={title || storeConfig.storeName}
              fill
              className="object-cover"
              priority={current === 0}
              sizes="100vw"
            />
          </motion.div>

          {/* Enhanced gradient overlay with vignette */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent rtl:from-transparent rtl:via-black/30 rtl:to-black/70" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

          {/* Content */}
          {title && (
            <div className="absolute inset-0 flex items-center">
              <div className="container-shop text-white">
                <div className="max-w-lg">
                  {/* Animated accent line */}
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: 60 }}
                    transition={{ delay: 0.15, duration: 0.5, ease: "easeOut" }}
                    className="h-1 bg-gradient-to-r from-accent to-blue-400 rounded-full mb-5"
                  />
                  <motion.h2
                    initial={{ y: 30, opacity: 0, filter: "blur(8px)" }}
                    animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                    transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
                    className="font-heading text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-5 drop-shadow-lg"
                  >
                    {title}
                  </motion.h2>
                  {banner.link && (
                    <motion.div
                      initial={{ y: 30, opacity: 0, filter: "blur(8px)" }}
                      animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                      transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
                    >
                      <Link
                        href={banner.link}
                        className="btn btn-primary text-base px-8 py-3.5 shadow-glow hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] transition-shadow duration-300"
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

      {/* Navigation arrows — glass morphism style */}
      {banners.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute start-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/25 text-white backdrop-blur-md border border-white/20 transition-all duration-300 hover:scale-110"
            aria-label="Previous"
          >
            <ChevronLeft className="w-5 h-5 rtl:rotate-180" />
          </button>
          <button
            onClick={next}
            className="absolute end-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/25 text-white backdrop-blur-md border border-white/20 transition-all duration-300 hover:scale-110"
            aria-label="Next"
          >
            <ChevronRight className="w-5 h-5 rtl:rotate-180" />
          </button>
        </>
      )}

      {/* Progress-bar dot navigation */}
      {banners.length > 1 && (
        <div className="absolute bottom-5 inset-x-0 flex justify-center gap-2.5 z-10">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setDirection(i > current ? 1 : -1);
                setCurrent(i);
              }}
              className="relative h-1.5 rounded-full overflow-hidden transition-all duration-500 bg-white/30"
              style={{ width: i === current ? 32 : 12 }}
              aria-label={`Slide ${i + 1}`}
            >
              {i === current && (
                <motion.div
                  className="absolute inset-0 bg-white rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: AUTOPLAY_DELAY / 1000, ease: "linear" }}
                  style={{ transformOrigin: "left" }}
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
