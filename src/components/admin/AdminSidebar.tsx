"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Package,
  Grid3X3,
  Tag,
  Image,
  Star,
  HelpCircle,
  Megaphone,
  ActivitySquare,
  LogOut,
  Zap,
  X,
} from "lucide-react";
import { useAdminT } from "@/hooks/useAdminT";
import type { AdminLocale, AdminTranslationKey } from "@/i18n/admin";

const navItems: {
  href: string;
  labelKey: AdminTranslationKey;
  icon: typeof LayoutDashboard;
}[] = [
  { href: "/admin/dashboard", labelKey: "nav_dashboard", icon: LayoutDashboard },
  { href: "/admin/products", labelKey: "nav_products", icon: Package },
  { href: "/admin/categories", labelKey: "nav_categories", icon: Grid3X3 },
  { href: "/admin/offers", labelKey: "nav_offers", icon: Tag },
  { href: "/admin/hero-banners", labelKey: "nav_hero_banners", icon: Image },
  { href: "/admin/testimonials", labelKey: "nav_testimonials", icon: Star },
  { href: "/admin/faq", labelKey: "nav_faq", icon: HelpCircle },
  { href: "/admin/announcement", labelKey: "nav_announcement", icon: Megaphone },
  { href: "/admin/activity-log", labelKey: "nav_activity_log", icon: ActivitySquare },
];

const languages: { code: AdminLocale; label: string; flag: string }[] = [
  { code: "fr", label: "FR", flag: "🇫🇷" },
  { code: "ar", label: "AR", flag: "🇲🇦" },
  { code: "en", label: "EN", flag: "🇬🇧" },
];

interface AdminSidebarProps {
  onClose?: () => void;
}

export function AdminSidebar({ onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const { t, locale, setLocale } = useAdminT();

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-gray-900 dark:text-white text-sm">
            {t("admin_panel")}
          </span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 lg:hidden"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {t(item.labelKey)}
            </Link>
          );
        })}
      </nav>

      {/* Language switcher */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-700">
        <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-1.5 px-1">
          {t("language")}
        </p>
        <div className="flex gap-1">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setLocale(lang.code)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-colors border ${
                locale === lang.code
                  ? "bg-blue-50 dark:bg-blue-900/20 border-blue-400 text-blue-600 dark:text-blue-400"
                  : "border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <span>{lang.flag}</span>
              <span>{lang.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Logout */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 w-full transition-colors"
        >
          <LogOut className="w-4 h-4" />
          {t("logout")}
        </button>
      </div>
    </div>
  );
}
