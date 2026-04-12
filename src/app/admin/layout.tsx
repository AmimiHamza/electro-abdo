import type { Metadata } from "next";
import { AdminLayoutClient } from "@/components/admin/AdminLayoutClient";
import { Outfit, DM_Sans } from "next/font/google";
import "../globals.css";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit", display: "swap" });
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans", display: "swap" });

export const metadata: Metadata = {
  title: { default: "Admin Panel", template: "%s — Admin" },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${outfit.variable} ${dmSans.variable}`}>
      <body className="font-body antialiased bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
        <AdminLayoutClient>{children}</AdminLayoutClient>
      </body>
    </html>
  );
}
