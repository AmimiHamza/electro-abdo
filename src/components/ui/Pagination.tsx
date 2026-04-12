"use client";

import { useRouter, usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  total: number;
  pageSize: number;
  searchParams: Record<string, string>;
}

export function Pagination({
  currentPage,
  totalPages,
  total,
  pageSize,
  searchParams,
}: PaginationProps) {
  const router = useRouter();
  const pathname = usePathname();

  if (totalPages <= 1) return null;

  const navigate = (page: number) => {
    const params = new URLSearchParams(searchParams);
    if (page === 1) {
      params.delete("page");
    } else {
      params.set("page", String(page));
    }
    const qs = params.toString();
    router.push(`${pathname}${qs ? `?${qs}` : ""}`);
  };

  // Build page number list (max 5 shown)
  const getPages = () => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    pages.push(1);
    if (currentPage > 3) pages.push("...");
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
    return pages;
  };

  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, total);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-border">
      <p className="text-sm text-muted-foreground">
        {start}–{end} / {total}
      </p>
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => navigate(currentPage - 1)}
          disabled={currentPage === 1}
          className="w-9 h-9 flex items-center justify-center rounded-lg border border-border hover:border-accent hover:text-accent disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          aria-label="Previous"
        >
          <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
        </button>

        {getPages().map((p, i) =>
          p === "..." ? (
            <span key={`dots-${i}`} className="px-1 text-muted-foreground">
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => navigate(p as number)}
              className={`min-w-[36px] h-9 px-2 rounded-lg text-sm font-medium transition-all ${
                p === currentPage
                  ? "bg-accent text-white"
                  : "border border-border hover:border-accent hover:text-accent"
              }`}
            >
              {p}
            </button>
          )
        )}

        <button
          onClick={() => navigate(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="w-9 h-9 flex items-center justify-center rounded-lg border border-border hover:border-accent hover:text-accent disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          aria-label="Next"
        >
          <ChevronRight className="w-4 h-4 rtl:rotate-180" />
        </button>
      </div>
    </div>
  );
}
