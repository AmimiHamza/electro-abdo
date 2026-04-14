"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { ProductCard, ProductCardData } from "@/components/product/ProductCard";

interface NewArrivalsProps {
  products: ProductCardData[];
  locale: string;
}

export function NewArrivals({ products, locale }: NewArrivalsProps) {
  const t = useTranslations("home");
  const scrollRef = useRef<HTMLDivElement>(null);

  if (products.length === 0) return null;

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = 300;
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  return (
    <section className="py-14">
      <div className="container-shop">
        {/* Section header */}
        <div className="flex items-end justify-between mb-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-accent animate-bounce-subtle" />
              <p className="text-accent font-semibold text-sm uppercase tracking-wider">
                {t("new_arrivals_subtitle")}
              </p>
            </div>
            <h2 className="font-heading text-2xl md:text-3xl font-bold">
              {t("new_arrivals_title")}
            </h2>
            <div className="section-line mt-2" />
          </motion.div>
          <div className="flex items-center gap-3">
            {/* Arrow buttons (desktop) */}
            <div className="hidden md:flex gap-1.5">
              <button
                onClick={() => scroll("left")}
                className="w-9 h-9 flex items-center justify-center rounded-full border border-border hover:border-accent hover:text-accent transition-all"
                aria-label="Previous"
              >
                <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
              </button>
              <button
                onClick={() => scroll("right")}
                className="w-9 h-9 flex items-center justify-center rounded-full border border-border hover:border-accent hover:text-accent transition-all"
                aria-label="Next"
              >
                <ChevronRight className="w-4 h-4 rtl:rotate-180" />
              </button>
            </div>
            <Link
              href={`/${locale}/search?sort=newest`}
              className="text-accent text-sm font-semibold hover:underline"
            >
              {t("see_all")}
            </Link>
          </div>
        </div>

        {/* Scrollable row */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 -mx-1 px-1"
          >
            {products.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
              >
                <ProductCard product={product} locale={locale} compact />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
