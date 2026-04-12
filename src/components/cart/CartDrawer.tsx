"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingCart, Minus, Plus, Trash2, MessageCircle, ShoppingBag } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCartStore } from "@/stores/cartStore";
import { useCartDrawerStore } from "@/stores/cartDrawerStore";
import { whatsappUrl } from "@/lib/utils";
import { storeConfig } from "@/config/store.config";

interface CartDrawerProps {
  locale: string;
}

export function CartDrawer({ locale }: CartDrawerProps) {
  const t = useTranslations("cart");
  const { items, removeItem, updateQuantity, totalItems, totalPrice } = useCartStore();
  const { isOpen, close } = useCartDrawerStore();

  const total = totalItems();
  const price = totalPrice();

  const generateWhatsAppMessage = () => {
    const storeName = storeConfig.storeName;
    const lines = items.map(
      (item) => `${item.quantity}x ${item.name} — ${(item.price * item.quantity).toLocaleString()} ${storeConfig.currency}`
    );
    const message = [
      `🛒 Nouvelle commande — ${storeName}`,
      `─────────────────`,
      ...lines,
      `─────────────────`,
      `💰 Total: ${price.toLocaleString()} ${storeConfig.currency}`,
    ].join("\n");
    return whatsappUrl(storeConfig.whatsappNumber, message);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 z-[110] bg-black/50 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: locale === "ar" ? "-100%" : "100%" }}
            animate={{ x: 0 }}
            exit={{ x: locale === "ar" ? "-100%" : "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 end-0 bottom-0 z-[111] w-full max-w-[400px] bg-surface border-s border-border shadow-card-hover flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="font-heading font-bold text-lg flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-accent" />
                {t("title")}
                {total > 0 && (
                  <span className="text-sm font-normal text-muted-foreground">
                    ({total} {total === 1 ? t("item") : t("items")})
                  </span>
                )}
              </h2>
              <button
                onClick={close}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-4">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center gap-4 text-center py-12">
                  <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
                    <ShoppingBag className="w-9 h-9 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{t("empty")}</p>
                    <p className="text-sm text-muted-foreground mt-1">{t("empty_subtitle")}</p>
                  </div>
                  <button
                    onClick={close}
                    className="btn btn-outline text-sm px-6"
                  >
                    {t("continue_shopping")}
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <AnimatePresence>
                    {items.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex gap-3 p-3 card"
                      >
                        {/* Image */}
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted shrink-0">
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover"
                              sizes="64px"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-accent/10">
                              <span className="text-accent font-bold text-lg">
                                {item.name.charAt(0)}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground line-clamp-2 leading-snug">
                            {item.name}
                          </p>
                          <p className="text-accent font-bold text-sm mt-1">
                            {(item.price * item.quantity).toLocaleString()} {storeConfig.currency}
                          </p>
                          {/* Qty controls */}
                          <div className="flex items-center gap-2 mt-2">
                            <div className="flex items-center border border-border rounded-lg overflow-hidden">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="w-7 h-7 flex items-center justify-center hover:bg-muted transition-colors"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-8 text-center text-xs font-semibold">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-7 h-7 flex items-center justify-center hover:bg-muted transition-colors"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-destructive/10 hover:text-destructive transition-colors text-muted-foreground"
                              aria-label="Remove"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-4 border-t border-border space-y-3">
                {/* Total */}
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{t("total")}</span>
                  <span className="font-bold text-xl text-accent">
                    {price.toLocaleString()} {storeConfig.currency}
                  </span>
                </div>

                {/* WhatsApp order */}
                <Link
                  href={generateWhatsAppMessage()}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={close}
                  className="btn py-3.5 text-sm bg-green-500 hover:bg-green-600 text-white flex items-center justify-center gap-2 rounded-xl font-bold transition-colors w-full"
                >
                  <MessageCircle className="w-4 h-4" />
                  {t("order_whatsapp")}
                </Link>

                {/* Cart page link */}
                <Link
                  href={`/${locale}/cart`}
                  onClick={close}
                  className="btn btn-outline text-sm w-full py-2.5 text-center"
                >
                  {t("title")}
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
