"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useAdminT } from "@/hooks/useAdminT";

export function ProductHeader({ titleKey, subtitle }: { titleKey: "new_product" | "edit_product"; subtitle?: string }) {
  const { t } = useAdminT();
  return (
    <div className="flex items-center gap-3 mb-6">
      <Link href="/admin/products" className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
        <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
      </Link>
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t(titleKey)}</h1>
        {subtitle && <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>}
      </div>
    </div>
  );
}
