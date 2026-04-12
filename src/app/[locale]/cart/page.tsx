"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Minus, Plus, Trash2, MessageCircle, ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/stores/cartStore";
import { whatsappUrl } from "@/lib/utils";
import { storeConfig } from "@/config/store.config";
import { useParams } from "next/navigation";

export default function CartPage() {
  const params = useParams();
  const locale = (params?.locale as string) || "fr";
  const t = useTranslations("cart");
  const { items, removeItem, updateQuantity, totalItems, totalPrice, clearCart } = useCartStore();

  const total = totalItems();
  const price = totalPrice();

  const generateWhatsAppMessage = () => {
    const storeName = storeConfig.storeName;
    const lines = items.map(
      (item) =>
        `${item.quantity}x ${item.name} — ${(item.price * item.quantity).toLocaleString()} ${storeConfig.currency}`
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

  if (items.length === 0) {
    return (
      <div className="container-shop py-16 flex flex-col items-center justify-center gap-6 text-center min-h-[60vh]">
        <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
          <ShoppingBag className="w-12 h-12 text-muted-foreground" />
        </div>
        <div>
          <h1 className="font-heading text-2xl font-bold">{t("empty")}</h1>
          <p className="text-muted-foreground mt-2">{t("empty_subtitle")}</p>
        </div>
        <Link href={`/${locale}`} className="btn btn-primary px-8">
          {t("continue_shopping")}
        </Link>
      </div>
    );
  }

  return (
    <div className="container-shop py-8">
      <div className="flex items-center gap-3 mb-6">
        <Link
          href={`/${locale}`}
          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
        >
          <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
        </Link>
        <h1 className="font-heading text-2xl font-bold">{t("title")}</h1>
        <span className="text-muted-foreground text-sm">
          ({total} {total === 1 ? t("item") : t("items")})
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Items list */}
        <div className="lg:col-span-2 space-y-3">
          <AnimatePresence>
            {items.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.2 }}
                className="card p-4 flex gap-4"
              >
                {/* Image */}
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-muted shrink-0">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-accent/10">
                      <span className="text-accent font-bold text-xl">
                        {item.name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/${locale}/product/${item.id}`}
                    className="text-sm font-semibold text-foreground hover:text-accent transition-colors line-clamp-2"
                  >
                    {item.name}
                  </Link>
                  <p className="text-accent font-bold mt-1">
                    {item.price.toLocaleString()} {storeConfig.currency}
                  </p>

                  <div className="flex items-center justify-between mt-3">
                    {/* Qty */}
                    <div className="flex items-center border border-border rounded-lg overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-muted transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-10 text-center text-sm font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-muted transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-bold text-foreground text-sm">
                        {(item.price * item.quantity).toLocaleString()} {storeConfig.currency}
                      </span>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-destructive/10 hover:text-destructive transition-colors text-muted-foreground"
                        aria-label={t("remove")}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          <button
            onClick={clearCart}
            className="text-sm text-destructive hover:underline mt-2"
          >
            {locale === "ar" ? "مسح الكل" : locale === "en" ? "Clear cart" : "Vider le panier"}
          </button>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-24">
            <h2 className="font-heading font-bold text-lg mb-4">{t("subtotal")}</h2>

            <div className="space-y-2 pb-4 border-b border-border">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground truncate flex-1 me-2">
                    {item.name} ×{item.quantity}
                  </span>
                  <span className="font-medium shrink-0">
                    {(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between py-4 border-b border-border">
              <span className="font-bold text-lg">{t("total")}</span>
              <span className="font-bold text-2xl text-accent">
                {price.toLocaleString()} {storeConfig.currency}
              </span>
            </div>

            <div className="mt-4 space-y-3">
              <Link
                href={generateWhatsAppMessage()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn py-4 text-sm bg-green-500 hover:bg-green-600 text-white flex items-center justify-center gap-2 rounded-xl font-bold transition-colors w-full"
              >
                <MessageCircle className="w-5 h-5" />
                {t("order_whatsapp")}
              </Link>

              <Link
                href={`/${locale}`}
                className="btn btn-outline text-sm w-full py-3 text-center"
              >
                {t("continue_shopping")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
