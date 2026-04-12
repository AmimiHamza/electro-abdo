"use client";

import { useState, useEffect } from "react";
import { ShoppingCart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { useCartStore } from "@/stores/cartStore";
import { storeConfig } from "@/config/store.config";

interface StickyAddToCartProps {
  productId: string;
  productName: string;
  price: number;
  image: string;
  stock: number;
  categoryId: string;
}

export function StickyAddToCart({
  productId,
  productName,
  price,
  image,
  stock,
  categoryId,
}: StickyAddToCartProps) {
  const t = useTranslations("product");
  const addToCart = useCartStore((s) => s.addItem);
  const [visible, setVisible] = useState(false);
  const [added, setAdded] = useState(false);

  // Show after scrolling past ~500px (past the main add-to-cart on desktop)
  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 500);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isOutOfStock = stock === 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart({ id: productId, name: productName, price, image, categoryId });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 28, stiffness: 260 }}
          className="fixed bottom-16 inset-x-0 z-40 md:hidden px-4 pb-2 safe-area-bottom"
        >
          <div className="card flex items-center gap-3 p-3 shadow-card-hover">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground truncate">
                {productName}
              </p>
              <p className="font-bold text-accent">
                {price.toLocaleString()} {storeConfig.currency}
              </p>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`btn text-sm px-4 py-2.5 shrink-0 ${
                isOutOfStock
                  ? "bg-muted text-muted-foreground cursor-not-allowed"
                  : added
                  ? "bg-green-500 text-white"
                  : "btn-primary"
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              {isOutOfStock
                ? t("out_of_stock")
                : added
                ? "✓"
                : t("add_to_cart")}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
