import type { Metadata } from "next";
import { Outfit, DM_Sans, IBM_Plex_Sans_Arabic } from "next/font/google";
import { notFound } from "next/navigation";
import { getMessages } from "next-intl/server";
import { Providers } from "@/components/Providers";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { FloatingWhatsApp } from "@/components/layout/FloatingWhatsApp";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import { LanguageSelector } from "@/components/ui/LanguageSelector";
import { QuickViewModal } from "@/components/product/QuickViewModal";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { ToastContainer } from "@/components/ui/Toast";
import { prisma } from "@/lib/prisma";
import { storeConfig } from "@/config/store.config";
import "../globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-ibm-plex-arabic",
  display: "swap",
});

const locales = ["fr", "ar", "en"] as const;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://electroabdo.ma";

export const metadata: Metadata = {
  title: {
    default: storeConfig.storeName,
    template: `%s — ${storeConfig.storeName}`,
  },
  description: storeConfig.storeTagline.fr,
  metadataBase: new URL(BASE_URL),
  openGraph: {
    siteName: storeConfig.storeName,
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = params;

  if (!locales.includes(locale as (typeof locales)[number])) {
    notFound();
  }

  const messages = await getMessages();
  const isRTL = locale === "ar";

  // Fetch active announcement from DB (empty array if DB not seeded yet)
  const announcement = await prisma.announcement
    .findFirst({ where: { isActive: true } })
    .catch(() => null);

  return (
    <html
      lang={locale}
      dir={isRTL ? "rtl" : "ltr"}
      suppressHydrationWarning
      className={`${outfit.variable} ${dmSans.variable} ${ibmPlexArabic.variable}`}
    >
      <body className="font-body antialiased bg-background text-foreground">
        <Providers locale={locale} messages={messages}>
          {/* Language selection modal (first visit) */}
          <LanguageSelector currentLocale={locale} />

          {/* Top announcement bar */}
          {announcement && (
            <AnnouncementBar announcement={announcement} locale={locale} />
          )}

          {/* Navigation */}
          <Navbar locale={locale} />

          {/* Main content */}
          <main className="min-h-[calc(100vh-4rem)] pb-16 md:pb-0">
            {children}
          </main>

          {/* Footer */}
          <Footer locale={locale} />

          {/* Mobile bottom navigation */}
          <MobileBottomNav locale={locale} />

          {/* Floating utilities */}
          <FloatingWhatsApp />
          <ScrollToTop />

          {/* Global quick-view modal (all pages) */}
          <QuickViewModal locale={locale} />

          {/* Cart slide-out drawer */}
          <CartDrawer locale={locale} />

          {/* Toast notifications */}
          <ToastContainer />
        </Providers>
      </body>
    </html>
  );
}
