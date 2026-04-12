"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Search, X, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface SearchProduct {
  id: string;
  name_fr: string;
  name_ar: string;
  name_en: string;
  price: number;
  images: { url: string }[];
}

interface SearchBarProps {
  locale: string;
  onClose?: () => void;
}

export function SearchBar({ locale, onClose }: SearchBarProps) {
  const t = useTranslations("search");
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const nameKey = `name_${locale}` as keyof SearchProduct;

  const search = useCallback(
    async (q: string) => {
      if (!q.trim() || q.length < 2) {
        setResults([]);
        setOpen(false);
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(
          `/api/products?search=${encodeURIComponent(q)}&limit=5`
        );
        const data = await res.json();
        setResults(Array.isArray(data) ? data : []);
        setOpen(true);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(query), 300);
    return () => clearTimeout(debounceRef.current);
  }, [query, search]);

  // Click outside to close
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setOpen(false);
      onClose?.();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < results.length) {
        const product = results[activeIndex];
        router.push(`/${locale}/product/${product.id}`);
        setOpen(false);
      } else if (query.trim()) {
        router.push(`/${locale}/search?q=${encodeURIComponent(query)}`);
        setOpen(false);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/${locale}/search?q=${encodeURIComponent(query)}`);
      setOpen(false);
      onClose?.();
    }
  };

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setOpen(false);
    inputRef.current?.focus();
  };

  return (
    <div className="relative w-full">
      <form onSubmit={handleSubmit}>
        <div className="relative flex items-center">
          <Search className="absolute start-3 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => query.length >= 2 && setOpen(true)}
            placeholder={t("placeholder")}
            className="w-full bg-muted/60 border border-transparent focus:border-accent focus:bg-surface rounded-xl ps-9 pe-9 py-2.5 text-sm transition-all outline-none placeholder:text-muted-foreground"
            autoComplete="off"
          />
          {loading ? (
            <Loader2 className="absolute end-3 w-4 h-4 text-muted-foreground animate-spin" />
          ) : query ? (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute end-3 w-4 h-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          ) : null}
        </div>
      </form>

      {/* Results dropdown */}
      {open && (
        <div
          ref={dropdownRef}
          className="absolute top-full start-0 end-0 mt-2 bg-surface border border-border rounded-xl shadow-card-hover z-50 overflow-hidden animate-slide-down"
        >
          {results.length > 0 ? (
            <>
              {results.map((product, i) => (
                <button
                  key={product.id}
                  onClick={() => {
                    router.push(`/${locale}/product/${product.id}`);
                    setOpen(false);
                    onClose?.();
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-start hover:bg-muted transition-colors ${
                    i === activeIndex ? "bg-muted" : ""
                  }`}
                >
                  <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                    {product.images[0] ? (
                      <Image
                        src={product.images[0].url}
                        alt={String(product[nameKey] || product.name_fr)}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <Search className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {String(product[nameKey] || product.name_fr)}
                    </p>
                    <p className="text-xs text-accent font-semibold">
                      {product.price.toLocaleString()} DH
                    </p>
                  </div>
                </button>
              ))}
              <button
                onClick={() => {
                  router.push(
                    `/${locale}/search?q=${encodeURIComponent(query)}`
                  );
                  setOpen(false);
                  onClose?.();
                }}
                className={`w-full px-4 py-3 text-sm text-accent font-medium text-center hover:bg-muted transition-colors border-t border-border ${
                  activeIndex === results.length ? "bg-muted" : ""
                }`}
              >
                {t("see_all_results")} &quot;{query}&quot;
              </button>
            </>
          ) : (
            <div className="px-4 py-6 text-center text-muted-foreground text-sm">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p>{t("no_results")}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
