"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  ShoppingCart,
  Search,
  Menu,
  X,
  ChevronDown,
  Zap,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useCartStore } from "@/stores/cartStore";
import { useFavoritesStore } from "@/stores/favoritesStore";
import { useSettingsStore } from "@/stores/settingsStore";
import { useCartDrawerStore } from "@/stores/cartDrawerStore";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { SearchBar } from "@/components/ui/SearchBar";
import { storeConfig } from "@/config/store.config";

const languages = [
  { code: "fr", label: "FR", flag: "🇫🇷" },
  { code: "ar", label: "AR", flag: "🇲🇦" },
  { code: "en", label: "EN", flag: "🇬🇧" },
] as const;

interface NavbarProps {
  locale: string;
}

export function Navbar({ locale }: NavbarProps) {
  const t = useTranslations("nav");
  const router = useRouter();
  const pathname = usePathname();
  const totalItems = useCartStore((s) => s.totalItems());
  const totalPrice = useCartStore((s) => s.totalPrice());
  const favCount = useFavoritesStore((s) => s.items.length);
  const { setLocale } = useSettingsStore();
  const openCartDrawer = useCartDrawerStore((s) => s.open);

  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // Suppress Zustand localStorage values until hydrated
  const cartItems = mounted ? totalItems : 0;
  const cartPrice = mounted ? totalPrice : 0;
  const favItems = mounted ? favCount : 0;

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Close drawer on route change
  useEffect(() => {
    setDrawerOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: `/${locale}`, label: t("home") },
    { href: `/${locale}/offers`, label: t("offers") },
    { href: `/${locale}/about`, label: t("about") },
    { href: `/${locale}/faq`, label: t("faq") },
  ];

  const switchLocale = (code: string) => {
    setLocale(code as "fr" | "ar" | "en");
    setLangOpen(false);
    const segments = pathname.split("/");
    segments[1] = code;
    router.push(segments.join("/") || `/${code}`);
  };

  const currentLang = languages.find((l) => l.code === locale) || languages[0];

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? "bg-[var(--navbar-bg)] backdrop-blur-md shadow-card border-b border-border"
            : "bg-[var(--navbar-bg)] backdrop-blur-sm"
        }`}
      >
        <nav className="container-shop">
          <div className="flex items-center gap-3 h-16">
            {/* ── MOBILE: Hamburger ── */}
            <button
              onClick={() => setDrawerOpen(true)}
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
              aria-label={t("menu")}
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* ── LOGO ── */}
            <Link
              href={`/${locale}`}
              className="flex items-center gap-2 shrink-0"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-blue-400 flex items-center justify-center shadow-glow">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="font-heading font-bold text-lg hidden sm:block leading-none">
                {storeConfig.storeName}
              </span>
            </Link>

            {/* ── DESKTOP SEARCH (center) ── */}
            <div className="hidden md:flex flex-1 max-w-xl mx-4">
              <SearchBar locale={locale} />
            </div>

            {/* ── RIGHT ACTIONS ── */}
            <div className="flex items-center gap-1 ms-auto">
              {/* Mobile search toggle */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="md:hidden w-9 h-9 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
                aria-label={t("search")}
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Language switcher (desktop) */}
              <div className="relative hidden md:block">
                <button
                  onClick={() => setLangOpen(!langOpen)}
                  className="flex items-center gap-1.5 px-3 h-9 rounded-full hover:bg-muted text-sm font-semibold transition-colors"
                  aria-label="Language"
                >
                  <span>{currentLang.flag}</span>
                  <span className="text-xs">{currentLang.label}</span>
                  <ChevronDown
                    className={`w-3 h-3 transition-transform ${langOpen ? "rotate-180" : ""}`}
                  />
                </button>

                <AnimatePresence>
                  {langOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setLangOpen(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full end-0 mt-2 bg-surface border border-border rounded-xl shadow-card-hover z-20 overflow-hidden min-w-[130px]"
                      >
                        {languages.map((lang) => (
                          <button
                            key={lang.code}
                            onClick={() => switchLocale(lang.code)}
                            className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-muted transition-colors ${
                              locale === lang.code
                                ? "text-accent font-semibold"
                                : "text-foreground"
                            }`}
                          >
                            <span>{lang.flag}</span>
                            <span>{lang.label}</span>
                          </button>
                        ))}
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              {/* Theme toggle */}
              <ThemeToggle compact />

              {/* Favorites */}
              <Link
                href={`/${locale}/favorites`}
                className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
                aria-label={t("favorites")}
              >
                <Heart className="w-5 h-5" />
                {favItems > 0 && (
                  <span className="absolute -top-0.5 -end-0.5 min-w-[18px] h-[18px] bg-accent text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                    {favItems > 99 ? "99+" : favItems}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <button
                onClick={openCartDrawer}
                className="relative flex items-center gap-2 ps-2.5 pe-3 h-9 rounded-full hover:bg-muted transition-all group"
                aria-label={t("cart")}
              >
                <span className="relative">
                  <ShoppingCart className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  {cartItems > 0 && (
                    <span className="absolute -top-1.5 -end-1.5 min-w-[16px] h-4 bg-accent text-white text-[9px] font-bold rounded-full flex items-center justify-center px-0.5">
                      {cartItems > 99 ? "99+" : cartItems}
                    </span>
                  )}
                </span>
                {cartItems > 0 && (
                  <span className="hidden sm:block text-xs font-bold text-accent whitespace-nowrap">
                    {cartPrice.toLocaleString()} DH
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* ── MOBILE SEARCH BAR (expanded) ── */}
          <AnimatePresence>
            {searchOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="md:hidden overflow-hidden"
              >
                <div className="pb-3">
                  <SearchBar
                    locale={locale}
                    onClose={() => setSearchOpen(false)}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </header>

      {/* ── MOBILE DRAWER ── */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
              className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm md:hidden"
            />

            {/* Drawer panel */}
            <motion.aside
              initial={{ x: locale === "ar" ? "100%" : "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: locale === "ar" ? "100%" : "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 start-0 bottom-0 z-[101] w-72 bg-surface border-e border-border shadow-card-hover md:hidden flex flex-col"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                <Link
                  href={`/${locale}`}
                  className="flex items-center gap-2"
                  onClick={() => setDrawerOpen(false)}
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-blue-400 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-heading font-bold text-lg">
                    {storeConfig.storeName}
                  </span>
                </Link>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
                  aria-label={t("close")}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Drawer nav links */}
              <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        isActive
                          ? "bg-accent/10 text-accent"
                          : "hover:bg-muted text-foreground"
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </nav>

              {/* Drawer bottom: language + theme */}
              <div className="p-4 border-t border-border space-y-4">
                {/* Language selector */}
                <div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2 px-1">
                    Language
                  </p>
                  <div className="flex gap-2">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => switchLocale(lang.code)}
                        className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-xl text-xs font-semibold transition-all border ${
                          locale === lang.code
                            ? "border-accent bg-accent/10 text-accent"
                            : "border-border hover:border-accent/50 text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <span className="text-lg">{lang.flag}</span>
                        <span>{lang.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Theme */}
                <div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2 px-1">
                    Theme
                  </p>
                  <ThemeToggle />
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
