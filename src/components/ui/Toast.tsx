"use client";

import { useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";
import { useToastStore } from "@/stores/toastStore";

function ToastItem({ id, type, message, image }: {
  id: string;
  type: "success" | "error" | "info";
  message: string;
  image?: string;
}) {
  const removeToast = useToastStore((s) => s.removeToast);

  const icon = type === "success"
    ? <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
    : type === "error"
    ? <AlertCircle className="w-4 h-4 text-destructive shrink-0" />
    : <Info className="w-4 h-4 text-accent shrink-0" />;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 60, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 60, scale: 0.9 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      className="flex items-center gap-3 bg-surface border border-border rounded-xl shadow-card-hover px-4 py-3 min-w-[240px] max-w-[320px] pointer-events-auto"
    >
      {image && (
        <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-muted shrink-0">
          <Image src={image} alt="" fill className="object-cover" sizes="40px" />
        </div>
      )}
      {!image && icon}
      <p className="flex-1 text-sm font-medium text-foreground leading-snug">
        {message}
      </p>
      <button
        onClick={() => removeToast(id)}
        className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-muted transition-colors shrink-0"
        aria-label="Dismiss"
      >
        <X className="w-3 h-3 text-muted-foreground" />
      </button>
    </motion.div>
  );
}

export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);

  return (
    <div
      className="fixed top-20 end-4 z-[200] flex flex-col gap-2 pointer-events-none"
      aria-live="polite"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} {...toast} />
        ))}
      </AnimatePresence>
    </div>
  );
}
