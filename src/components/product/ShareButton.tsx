"use client";

import { useState, useRef, useEffect } from "react";
import { Share2, MessageCircle, Link2, Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { whatsappUrl } from "@/lib/utils";
import { storeConfig } from "@/config/store.config";

interface ShareButtonProps {
  productName: string;
  price: number;
}

export function ShareButton({ productName, price }: ShareButtonProps) {
  const t = useTranslations("product");
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        setOpen(false);
      }, 1500);
    } catch {
      // fallback: ignore
    }
  };

  const handleWhatsApp = () => {
    const message = `${productName} — ${price.toLocaleString()} ${storeConfig.currency}\n${window.location.href}`;
    window.open(whatsappUrl(storeConfig.whatsappNumber, message), "_blank");
    setOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-accent transition-colors"
        aria-label={t("share")}
      >
        <Share2 className="w-4 h-4" />
        <span>{t("share")}</span>
      </button>

      {open && (
        <div className="absolute end-0 top-8 z-50 w-48 card py-1 shadow-card-hover animate-in fade-in slide-in-from-top-2 duration-150">
          <button
            onClick={handleWhatsApp}
            className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
          >
            <MessageCircle className="w-4 h-4 text-green-500" />
            {t("share_whatsapp")}
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
          >
            {copied ? (
              <Check className="w-4 h-4 text-accent" />
            ) : (
              <Link2 className="w-4 h-4 text-muted-foreground" />
            )}
            {copied ? t("link_copied") ?? "Copié !" : t("copy_link")}
          </button>
        </div>
      )}
    </div>
  );
}
