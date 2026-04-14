"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Tag } from "lucide-react";
import { storeConfig } from "@/config/store.config";

interface CategoryWithMeta {
  id: string;
  name_fr: string;
  name_ar: string;
  name_en: string;
  slug: string;
  image?: string | null;
  _count: { products: number };
  minPrice?: number | null;
}

interface CategoriesGridProps {
  categories: CategoryWithMeta[];
  locale: string;
}

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring" as const, damping: 20, stiffness: 200 },
  },
};

export function CategoriesGrid({ categories, locale }: CategoriesGridProps) {
  const t = useTranslations("home");
  const nameKey = `name_${locale}` as "name_fr" | "name_ar" | "name_en";

  if (categories.length === 0) return null;

  return (
    <section className="py-14 bg-muted/30">
      <div className="container-shop">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-end justify-between mb-8"
        >
          <div>
            <p className="text-accent font-semibold text-sm uppercase tracking-wider mb-1">
              {t("categories_subtitle")}
            </p>
            <h2 className="font-heading text-2xl md:text-3xl font-bold">
              {t("categories_title")}
            </h2>
            <div className="section-line mt-2" />
          </div>
        </motion.div>

        {/* Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4"
        >
          {categories.map((cat) => {
            const name = cat[nameKey] || cat.name_fr;
            return (
              <motion.div key={cat.id} variants={itemVariants}>
                <Link
                  href={`/${locale}/category/${cat.slug}`}
                  className="group flex flex-col items-center text-center p-4 rounded-2xl bg-surface border border-border hover:border-accent/40 hover-glow transition-all duration-300"
                >
                  {/* Category image / icon */}
                  <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-accent/5 to-blue-400/10 mb-3 group-hover:scale-[1.08] transition-transform duration-500 ease-out">
                    {cat.image ? (
                      <Image
                        src={cat.image}
                        alt={name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 16vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Tag className="w-10 h-10 text-accent/40" />
                      </div>
                    )}
                  </div>

                  {/* Name */}
                  <p className="font-semibold text-sm text-foreground group-hover:text-accent transition-colors leading-snug mb-1">
                    {name}
                  </p>

                  {/* Starting price */}
                  {cat.minPrice != null && cat.minPrice > 0 ? (
                    <p className="text-[11px] text-muted-foreground">
                      {locale === "ar" ? "من " : locale === "en" ? "From " : "Dès "}
                      <span className="text-accent font-bold">
                        {cat.minPrice.toLocaleString()} {storeConfig.currency}
                      </span>
                    </p>
                  ) : (
                    <p className="text-[11px] text-muted-foreground">
                      {cat._count.products} {locale === "ar" ? "منتج" : locale === "en" ? "products" : "produits"}
                    </p>
                  )}
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
