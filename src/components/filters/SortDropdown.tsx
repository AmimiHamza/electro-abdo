"use client";

import { useRouter, usePathname } from "next/navigation";
import { ArrowUpDown } from "lucide-react";
import { useTranslations } from "next-intl";

interface SortDropdownProps {
  currentSort: string;
  searchParams: Record<string, string>;
}

const SORT_OPTIONS = [
  { value: "popular", labelKey: "sort_popular" },
  { value: "newest", labelKey: "sort_newest" },
  { value: "price_asc", labelKey: "sort_price_asc" },
  { value: "price_desc", labelKey: "sort_price_desc" },
  { value: "az", labelKey: "sort_az" },
] as const;

export function SortDropdown({ currentSort, searchParams }: SortDropdownProps) {
  const t = useTranslations("filters");
  const router = useRouter();
  const pathname = usePathname();

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value === "popular") {
      params.delete("sort");
    } else {
      params.set("sort", value);
    }
    params.delete("page");
    const qs = params.toString();
    router.push(`${pathname}${qs ? `?${qs}` : ""}`);
  };

  return (
    <div className="flex items-center gap-2">
      <ArrowUpDown className="w-4 h-4 text-muted-foreground shrink-0" />
      <label className="text-sm text-muted-foreground whitespace-nowrap">
        {t("sort")}
      </label>
      <select
        value={currentSort}
        onChange={(e) => handleChange(e.target.value)}
        className="text-sm bg-surface border border-border rounded-lg px-3 py-2 text-foreground cursor-pointer hover:border-accent transition-colors focus:outline-none focus:border-accent"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {t(opt.labelKey)}
          </option>
        ))}
      </select>
    </div>
  );
}
