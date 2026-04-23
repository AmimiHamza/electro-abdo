"use client";

import Link from "next/link";
import { Package, Tag, Grid3X3, Eye, Plus, ExternalLink, Clock } from "lucide-react";
import { useAdminT } from "@/hooks/useAdminT";

interface LogItem {
  id: string;
  action: string;
  details: string | null;
  createdAt: string;
}

interface DashboardClientProps {
  stats: {
    totalProducts: number;
    activeOffers: number;
    totalCategories: number;
    totalViews: number;
    recentLogs: LogItem[];
  };
}

export function DashboardClient({ stats }: DashboardClientProps) {
  const { t } = useAdminT();

  const cards = [
    { labelKey: "stat_total_products" as const, value: stats.totalProducts, icon: Package, color: "blue", href: "/admin/products" },
    { labelKey: "stat_active_offers" as const, value: stats.activeOffers, icon: Tag, color: "green", href: "/admin/offers" },
    { labelKey: "stat_categories" as const, value: stats.totalCategories, icon: Grid3X3, color: "purple", href: "/admin/categories" },
    { labelKey: "stat_total_views" as const, value: stats.totalViews.toLocaleString(), icon: Eye, color: "orange", href: "#" },
  ];

  const colorMap: Record<string, string> = {
    blue: "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
    green: "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400",
    purple: "bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
    orange: "bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400",
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t("dashboard_title")}</h1>
        <div className="flex gap-2">
          <Link href="/admin/products/new" className="admin-btn-primary flex items-center gap-1.5">
            <Plus className="w-4 h-4" />
            {t("add_product")}
          </Link>
          <Link
            href="/"
            target="_blank"
            className="admin-btn-outline flex items-center gap-1.5"
          >
            <ExternalLink className="w-4 h-4" />
            {t("view_store")}
          </Link>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.labelKey}
              href={card.href}
              className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md transition-shadow"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${colorMap[card.color]}`}>
                <Icon className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{card.value}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{t(card.labelKey)}</p>
            </Link>
          );
        })}
      </div>

      {/* Recent activity */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900 dark:text-white">{t("recent_activity")}</h2>
          <Link href="/admin/activity-log" className="text-sm text-blue-600 hover:underline">
            {t("view_all")}
          </Link>
        </div>
        {stats.recentLogs.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-6">{t("no_activity")}</p>
        ) : (
          <div className="space-y-2">
            {stats.recentLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-start gap-3 py-2 border-b border-gray-100 dark:border-gray-700 last:border-0"
              >
                <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center shrink-0 mt-0.5">
                  <Clock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{log.action}</p>
                  {log.details && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{log.details}</p>
                  )}
                </div>
                <p className="text-xs text-gray-400 whitespace-nowrap shrink-0">
                  {new Date(log.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
