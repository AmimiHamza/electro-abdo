"use client";

import { useTranslations } from "next-intl";

interface TrustedBrandsProps {
  brands: string[];
}

// Fallback brands shown when DB is empty
const FALLBACK_BRANDS = [
  "Samsung", "Apple", "Xiaomi", "Huawei", "Oppo", "Vivo",
  "Anker", "Baseus", "JBL", "Sony", "OnePlus", "Realme",
];

export function TrustedBrands({ brands }: TrustedBrandsProps) {
  const t = useTranslations("home");
  const displayBrands = brands.length > 0 ? brands : FALLBACK_BRANDS;

  // Duplicate for seamless loop
  const loopBrands = [...displayBrands, ...displayBrands];

  return (
    <section className="py-12 overflow-hidden border-y border-border bg-surface">
      <div className="container-shop mb-8 text-center">
        <p className="text-muted-foreground text-xs uppercase tracking-widest mb-2">
          {t("brands_title")}
        </p>
        <h2 className="font-heading text-xl font-bold text-foreground">
          {t("brands_title")}
        </h2>
      </div>

      {/* Marquee container — pauses on hover */}
      <div className="relative marquee-pause">
        {/* Fade edges */}
        <div className="absolute inset-y-0 start-0 w-24 bg-gradient-to-r from-surface to-transparent z-10 pointer-events-none rtl:from-transparent rtl:to-surface" />
        <div className="absolute inset-y-0 end-0 w-24 bg-gradient-to-l from-surface to-transparent z-10 pointer-events-none rtl:from-transparent rtl:to-surface" />

        <div className="flex animate-marquee-slow whitespace-nowrap gap-5">
          {loopBrands.map((brand, i) => (
            <div
              key={`${brand}-${i}`}
              className="flex-shrink-0 px-7 py-3.5 rounded-xl border border-border bg-muted/30 hover:border-accent/50 hover:bg-accent/5 hover:shadow-glow transition-all duration-300 cursor-default group"
            >
              <span className="font-heading font-bold text-sm text-muted-foreground group-hover:text-accent transition-colors duration-300 tracking-wide">
                {brand}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
