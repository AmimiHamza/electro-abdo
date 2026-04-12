"use client";

import { useState } from "react";
import { SessionProvider } from "next-auth/react";
import { Menu } from "lucide-react";
import { AdminSidebar } from "./AdminSidebar";
import { AnimatePresence, motion } from "framer-motion";

export function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <SessionProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
        {/* Desktop sidebar */}
        <aside className="hidden lg:flex w-56 xl:w-64 shrink-0 flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 fixed inset-y-0 start-0 z-30">
          <AdminSidebar />
        </aside>

        {/* Mobile sidebar overlay */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSidebarOpen(false)}
                className="fixed inset-0 z-40 bg-black/50 lg:hidden"
              />
              <motion.aside
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                className="fixed inset-y-0 start-0 z-50 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 lg:hidden"
              >
                <AdminSidebar onClose={() => setSidebarOpen(false)} />
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main */}
        <div className="flex-1 flex flex-col lg:ms-56 xl:ms-64 min-h-screen">
          {/* Mobile top bar */}
          <header className="lg:hidden flex items-center gap-3 px-4 h-14 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-20">
            <button
              onClick={() => setSidebarOpen(true)}
              className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="font-bold text-gray-900 dark:text-white">Admin Panel</span>
          </header>

          <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </SessionProvider>
  );
}
