"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Home, Grid3X3, ShoppingCart, Heart, Menu } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCartStore } from "@/stores/cartStore";
import { useFavoritesStore } from "@/stores/favoritesStore";

interface MobileBottomNavProps {
  locale: string;
}

export function MobileBottomNav({ locale }: MobileBottomNavProps) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const totalItems = useCartStore((s) => s.totalItems());
  const favCount = useFavoritesStore((s) => s.items.length);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const cartBadge = mounted && totalItems > 0 ? totalItems : undefined;
  const favBadge = mounted && favCount > 0 ? favCount : undefined;

  const tabs = [
    {
      href: `/${locale}`,
      label: t("home"),
      icon: Home,
      exact: true,
    },
    {
      href: `/${locale}/offers`,
      label: t("offers"),
      icon: Grid3X3,
    },
    {
      href: `/${locale}/cart`,
      label: t("cart"),
      icon: ShoppingCart,
      badge: cartBadge,
    },
    {
      href: `/${locale}/favorites`,
      label: t("favorites"),
      icon: Heart,
      badge: favBadge,
    },
    {
      href: `/${locale}/about`,
      label: t("menu"),
      icon: Menu,
    },
  ];

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-surface/95 backdrop-blur-md border-t border-border"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex items-stretch h-14">
        {tabs.map((tab) => {
          const active = isActive(tab.href, tab.exact);
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex-1 flex flex-col items-center justify-center gap-1 text-[10px] font-medium transition-colors relative ${
                active
                  ? "text-accent"
                  : "text-muted-foreground"
              }`}
            >
              {active && (
                <span className="absolute top-0 inset-x-4 h-0.5 bg-accent rounded-b-full" />
              )}
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-all ${active ? "scale-110" : ""}`}
                />
                {tab.badge !== undefined && (
                  <span className="absolute -top-1.5 -end-1.5 min-w-[16px] h-4 bg-accent text-white text-[9px] font-bold rounded-full flex items-center justify-center px-0.5">
                    {tab.badge > 99 ? "99+" : tab.badge}
                  </span>
                )}
              </div>
              <span className="leading-none">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
