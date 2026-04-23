import type { Metadata } from "next";
import { AdminLayoutClient } from "@/components/admin/AdminLayoutClient";
import { Outfit, DM_Sans, IBM_Plex_Sans_Arabic } from "next/font/google";
import "../globals.css";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit", display: "swap" });
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans", display: "swap" });
const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm-plex-arabic",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "Admin Panel", template: "%s — Admin" },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="fr"
      dir="ltr"
      suppressHydrationWarning
      className={`${outfit.variable} ${dmSans.variable} ${ibmPlexArabic.variable}`}
    >
      <body className="font-body antialiased bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
        <AdminLayoutClient>{children}</AdminLayoutClient>
      </body>
    </html>
  );
}
