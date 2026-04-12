"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ProductImage {
  url: string;
  order: number;
}

interface ProductGalleryProps {
  images: ProductImage[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });

  const sorted = [...images].sort((a, b) => a.order - b.order);
  const hasImages = sorted.length > 0;
  const activeImage = sorted[activeIndex]?.url ?? null;

  const prev = useCallback(() => {
    setActiveIndex((i) => (i === 0 ? sorted.length - 1 : i - 1));
  }, [sorted.length]);

  const next = useCallback(() => {
    setActiveIndex((i) => (i === sorted.length - 1 ? 0 : i + 1));
  }, [sorted.length]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Main image */}
      <div
        className="relative aspect-square rounded-2xl overflow-hidden bg-muted group cursor-zoom-in select-none"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setZoomed(true)}
        onMouseLeave={() => setZoomed(false)}
      >
        {hasImages && activeImage ? (
          <>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.03 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0"
              >
                <Image
                  src={activeImage}
                  alt={`${productName} - ${activeIndex + 1}`}
                  fill
                  priority={activeIndex === 0}
                  className={`object-contain transition-transform duration-200 ${
                    zoomed ? "scale-150" : "scale-100"
                  }`}
                  style={
                    zoomed
                      ? {
                          transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                        }
                      : undefined
                  }
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </motion.div>
            </AnimatePresence>

            {/* Zoom indicator */}
            {!zoomed && (
              <div className="absolute bottom-3 end-3 bg-surface/80 backdrop-blur-sm rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <ZoomIn className="w-4 h-4 text-muted-foreground" />
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-accent/20 to-blue-400/20">
            <span className="text-7xl font-bold font-heading text-accent/30">
              {productName.charAt(0).toUpperCase()}
            </span>
          </div>
        )}

        {/* Prev / Next arrows (only when multiple images) */}
        {sorted.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute start-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-surface/80 backdrop-blur-sm shadow-card opacity-0 group-hover:opacity-100 transition-opacity hover:bg-surface z-10"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
            </button>
            <button
              onClick={next}
              className="absolute end-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-surface/80 backdrop-blur-sm shadow-card opacity-0 group-hover:opacity-100 transition-opacity hover:bg-surface z-10"
              aria-label="Next image"
            >
              <ChevronRight className="w-4 h-4 rtl:rotate-180" />
            </button>
          </>
        )}

        {/* Dot nav for mobile */}
        {sorted.length > 1 && (
          <div className="absolute bottom-3 inset-x-0 flex justify-center gap-1.5 sm:hidden">
            {sorted.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  i === activeIndex
                    ? "bg-accent w-4"
                    : "bg-surface/60 hover:bg-surface"
                }`}
                aria-label={`Image ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnail strip */}
      {sorted.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {sorted.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                i === activeIndex
                  ? "border-accent shadow-md"
                  : "border-border hover:border-accent/50"
              }`}
            >
              <div className="relative w-full h-full">
                <Image
                  src={img.url}
                  alt={`${productName} thumbnail ${i + 1}`}
                  fill
                  className="object-contain"
                  sizes="64px"
                />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
