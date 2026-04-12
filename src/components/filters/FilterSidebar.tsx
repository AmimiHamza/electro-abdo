"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, Filter, ChevronDown, ChevronUp, ToggleLeft, ToggleRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { storeConfig } from "@/config/store.config";

interface FilterSidebarProps {
  // Current filter values (from server search params)
  currentSort: string;
  selectedBrands: string[];
  selectedTags: string[];
  currentMinPrice?: number;
  currentMaxPrice?: number;
  inStockOnly: boolean;
  // Available options (from DB for this category)
  availableBrands: string[];
  availableTags: string[];
  priceRange: { min: number; max: number };
  // Pass-through for URL building
  searchParams: Record<string, string>;
}

function FilterSection({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-border pb-4 mb-4 last:border-0 last:mb-0 last:pb-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full text-sm font-semibold text-foreground mb-3"
      >
        {title}
        {open ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FilterSidebar({
  selectedBrands,
  selectedTags,
  currentMinPrice,
  currentMaxPrice,
  inStockOnly,
  availableBrands,
  availableTags,
  priceRange,
  searchParams,
}: FilterSidebarProps) {
  const t = useTranslations("filters");
  const router = useRouter();
  const pathname = usePathname();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [brandLetter, setBrandLetter] = useState<string | null>(null);
  const [minInput, setMinInput] = useState(currentMinPrice?.toString() ?? "");
  const [maxInput, setMaxInput] = useState(currentMaxPrice?.toString() ?? "");

  const hasActiveFilters =
    selectedBrands.length > 0 ||
    selectedTags.length > 0 ||
    currentMinPrice !== undefined ||
    currentMaxPrice !== undefined ||
    inStockOnly;

  const updateParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams);
    for (const [key, value] of Object.entries(updates)) {
      if (value === null || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    }
    params.delete("page");
    const qs = params.toString();
    router.push(`${pathname}${qs ? `?${qs}` : ""}`);
  };

  const toggleBrand = (brand: string) => {
    const next = selectedBrands.includes(brand)
      ? selectedBrands.filter((b) => b !== brand)
      : [...selectedBrands, brand];
    updateParams({ brands: next.length > 0 ? next.join(",") : null });
  };

  const toggleTag = (tag: string) => {
    const next = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];
    updateParams({ tags: next.length > 0 ? next.join(",") : null });
  };

  const applyPriceRange = () => {
    updateParams({
      min: minInput || null,
      max: maxInput || null,
    });
  };

  const clearAll = () => {
    const params = new URLSearchParams();
    if (searchParams.sort) params.set("sort", searchParams.sort);
    router.push(`${pathname}${params.toString() ? `?${params}` : ""}`);
    setMinInput("");
    setMaxInput("");
    setBrandLetter(null);
  };

  // A-Z letters available for current brand set
  const availableLetters = Array.from(
    new Set(availableBrands.map((b) => b.charAt(0).toUpperCase()))
  ).sort();

  const filteredBrands = brandLetter
    ? availableBrands.filter(
        (b) => b.charAt(0).toUpperCase() === brandLetter
      )
    : availableBrands;

  const FilterContent = () => (
    <div className="space-y-0">
      {/* Stock toggle */}
      <FilterSection title={t("in_stock_only")}>
        <button
          onClick={() =>
            updateParams({ stock: inStockOnly ? null : "1" })
          }
          className="flex items-center gap-2 text-sm"
        >
          {inStockOnly ? (
            <ToggleRight className="w-8 h-8 text-accent" />
          ) : (
            <ToggleLeft className="w-8 h-8 text-muted-foreground" />
          )}
          <span className={inStockOnly ? "text-accent font-medium" : "text-muted-foreground"}>
            {t("in_stock_only")}
          </span>
        </button>
      </FilterSection>

      {/* Price range */}
      <FilterSection title={t("price_range")}>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={minInput}
            onChange={(e) => setMinInput(e.target.value)}
            onBlur={applyPriceRange}
            onKeyDown={(e) => e.key === "Enter" && applyPriceRange()}
            placeholder={priceRange.min > 0 ? String(Math.floor(priceRange.min)) : "0"}
            className="w-full text-sm border border-border rounded-lg px-2 py-1.5 bg-surface focus:border-accent outline-none"
          />
          <span className="text-muted-foreground text-sm shrink-0">–</span>
          <input
            type="number"
            value={maxInput}
            onChange={(e) => setMaxInput(e.target.value)}
            onBlur={applyPriceRange}
            onKeyDown={(e) => e.key === "Enter" && applyPriceRange()}
            placeholder={priceRange.max > 0 ? String(Math.ceil(priceRange.max)) : "∞"}
            className="w-full text-sm border border-border rounded-lg px-2 py-1.5 bg-surface focus:border-accent outline-none"
          />
          <span className="text-xs text-muted-foreground shrink-0">{storeConfig.currency}</span>
        </div>
      </FilterSection>

      {/* Brand filter */}
      {availableBrands.length > 0 && (
        <FilterSection title={t("brand")}>
          {/* A-Z bar */}
          {availableLetters.length > 1 && (
            <div className="flex flex-wrap gap-1 mb-3">
              <button
                onClick={() => setBrandLetter(null)}
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded transition-all ${
                  brandLetter === null
                    ? "bg-accent text-white"
                    : "text-muted-foreground hover:text-accent"
                }`}
              >
                All
              </button>
              {availableLetters.map((letter) => (
                <button
                  key={letter}
                  onClick={() =>
                    setBrandLetter(brandLetter === letter ? null : letter)
                  }
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded transition-all ${
                    brandLetter === letter
                      ? "bg-accent text-white"
                      : "text-muted-foreground hover:text-accent"
                  }`}
                >
                  {letter}
                </button>
              ))}
            </div>
          )}
          {/* Brand list */}
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {filteredBrands.map((brand) => (
              <label
                key={brand}
                className="flex items-center gap-2.5 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(brand)}
                  onChange={() => toggleBrand(brand)}
                  className="w-4 h-4 rounded border-border accent-accent"
                />
                <span className="text-sm text-foreground group-hover:text-accent transition-colors">
                  {brand}
                </span>
              </label>
            ))}
            {filteredBrands.length === 0 && (
              <p className="text-xs text-muted-foreground">No brands starting with &ldquo;{brandLetter}&rdquo;</p>
            )}
          </div>
        </FilterSection>
      )}

      {/* Tags filter */}
      {availableTags.length > 0 && (
        <FilterSection title={t("tags")}>
          <div className="flex flex-wrap gap-1.5">
            {availableTags.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                  selectedTags.includes(tag)
                    ? "bg-accent text-white border-accent"
                    : "border-border text-muted-foreground hover:border-accent hover:text-accent"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </FilterSection>
      )}
    </div>
  );

  return (
    <>
      {/* ── MOBILE FILTER BUTTON ── */}
      <div className="flex items-center gap-3 lg:hidden mb-4">
        <button
          onClick={() => setMobileOpen(true)}
          className="flex items-center gap-2 btn btn-outline text-sm py-2 px-4"
        >
          <Filter className="w-4 h-4" />
          {t("title")}
          {hasActiveFilters && (
            <span className="min-w-[18px] h-[18px] bg-accent text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {selectedBrands.length + selectedTags.length + (inStockOnly ? 1 : 0) + (currentMinPrice !== undefined || currentMaxPrice !== undefined ? 1 : 0)}
            </span>
          )}
        </button>
        {hasActiveFilters && (
          <button
            onClick={clearAll}
            className="text-sm text-destructive hover:underline"
          >
            {t("clear_all")}
          </button>
        )}
      </div>

      {/* ── MOBILE DRAWER ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-[90] bg-black/50 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 start-0 bottom-0 z-[91] w-80 bg-surface border-e border-border shadow-card-hover lg:hidden flex flex-col"
            >
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h2 className="font-heading font-bold text-lg flex items-center gap-2">
                  <Filter className="w-5 h-5 text-accent" />
                  {t("title")}
                </h2>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                <FilterContent />
              </div>
              {hasActiveFilters && (
                <div className="p-4 border-t border-border">
                  <button onClick={clearAll} className="btn btn-outline w-full text-sm">
                    {t("clear_all")}
                  </button>
                </div>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── DESKTOP SIDEBAR ── */}
      <aside className="hidden lg:block w-64 xl:w-72 shrink-0">
        <div className="sticky top-24 card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading font-semibold text-base flex items-center gap-2">
              <Filter className="w-4 h-4 text-accent" />
              {t("title")}
            </h2>
            {hasActiveFilters && (
              <button
                onClick={clearAll}
                className="text-xs text-destructive hover:underline"
              >
                {t("clear_all")}
              </button>
            )}
          </div>
          <FilterContent />
        </div>
      </aside>
    </>
  );
}
