"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingCart, Heart, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { useQuickViewStore } from "@/stores/quickViewStore";
import { useCartStore } from "@/stores/cartStore";
import { useFavoritesStore } from "@/stores/favoritesStore";
import { discountPercent, parseSpecs, parseTags } from "@/lib/utils";
import { storeConfig } from "@/config/store.config";

interface FullProduct {
  id: string;
  name_fr: string; name_ar: string; name_en: string;
  description_fr: string; description_ar: string; description_en: string;
  price: number;
  oldPrice?: number | null;
  images: { id: string; url: string; order: number }[];
  stock: number;
  isNewArrival: boolean;
  warranty?: string | null;
  brand?: string | null;
  tags?: string | null;
  specs?: string | null;
  categoryId: string;
  category: { name_fr: string; name_ar: string; name_en: string; slug: string };
}

interface QuickViewModalProps {
  locale: string;
}

export function QuickViewModal({ locale }: QuickViewModalProps) {
  const t = useTranslations("product");
  const { productId, close } = useQuickViewStore();
  const addToCart = useCartStore((s) => s.addItem);
  const { toggleItem, isInFavorites } = useFavoritesStore();

  const [product, setProduct] = useState<FullProduct | null>(null);
  const [loading, setLoading] = useState(false);
  const [qty, setQty] = useState(1);
  const [imgIdx, setImgIdx] = useState(0);

  const nameKey = `name_${locale}` as keyof FullProduct;
  const descKey = `description_${locale}` as keyof FullProduct;

  // Fetch product when modal opens
  useEffect(() => {
    if (!productId) {
      setProduct(null);
      setQty(1);
      setImgIdx(0);
      return;
    }
    setLoading(true);
    fetch(`/api/products/${productId}`)
      .then((r) => r.json())
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [productId]);

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    if (productId) {
      document.addEventListener("keydown", handler);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [productId, close]);

  const handleAddToCart = () => {
    if (!product) return;
    const name = String(product[nameKey] || product.name_fr);
    const image = product.images?.[0]?.url ?? "";
    for (let i = 0; i < qty; i++) {
      addToCart({ id: product.id, name, price: product.price, image, categoryId: product.categoryId });
    }
    close();
  };

  const handleToggleFav = () => {
    if (!product) return;
    const name = String(product[nameKey] || product.name_fr);
    const image = product.images?.[0]?.url ?? "";
    toggleItem({ id: product.id, name, price: product.price, oldPrice: product.oldPrice ?? undefined, image, categoryId: product.categoryId });
  };

  const isFav = product ? isInFavorites(product.id) : false;
  const isOutOfStock = product ? product.stock === 0 : false;
  const discount = product?.oldPrice && product.oldPrice > product.price
    ? discountPercent(product.oldPrice, product.price)
    : null;

  const specs = product ? Object.entries(parseSpecs(product.specs)).slice(0, 4) : [];
  const tags = product ? parseTags(product.tags) : [];

  return (
    <AnimatePresence>
      {productId && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 z-[150] bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[151] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="pointer-events-auto w-full max-w-3xl bg-surface rounded-2xl shadow-card-hover border border-border overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              {/* Close button */}
              <button
                onClick={close}
                className="absolute top-4 end-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-surface border border-border hover:border-accent hover:text-accent transition-all"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>

              {loading || !product ? (
                <div className="flex items-center justify-center h-64">
                  <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2">
                  {/* LEFT: Gallery */}
                  <div className="relative bg-muted">
                    <div className="relative aspect-square">
                      {product.images.length > 0 ? (
                        <Image
                          src={product.images[imgIdx]?.url ?? product.images[0].url}
                          alt={String(product[nameKey] || product.name_fr)}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-accent/20 to-blue-400/20">
                          <span className="text-6xl font-bold font-heading text-accent/30">
                            {String(product[nameKey] || product.name_fr).charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                    {/* Thumbnail strip */}
                    {product.images.length > 1 && (
                      <div className="flex gap-2 p-3 overflow-x-auto scrollbar-hide">
                        {product.images.map((img, i) => (
                          <button
                            key={img.id}
                            onClick={() => setImgIdx(i)}
                            className={`relative w-14 h-14 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                              i === imgIdx ? "border-accent" : "border-transparent hover:border-accent/40"
                            }`}
                          >
                            <Image src={img.url} alt="" fill className="object-cover" sizes="56px" />
                          </button>
                        ))}
                      </div>
                    )}
                    {/* Prev/next */}
                    {product.images.length > 1 && (
                      <div className="absolute top-1/2 -translate-y-1/2 inset-x-2 flex justify-between pointer-events-none">
                        <button
                          onClick={() => setImgIdx((i) => (i - 1 + product.images.length) % product.images.length)}
                          className="pointer-events-auto w-8 h-8 flex items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 transition-all"
                        >
                          <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
                        </button>
                        <button
                          onClick={() => setImgIdx((i) => (i + 1) % product.images.length)}
                          className="pointer-events-auto w-8 h-8 flex items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 transition-all"
                        >
                          <ChevronRight className="w-4 h-4 rtl:rotate-180" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* RIGHT: Info */}
                  <div className="p-6 flex flex-col gap-4">
                    {/* Badges */}
                    <div className="flex flex-wrap gap-1.5">
                      {product.isNewArrival && <span className="badge badge-new">{t("new")}</span>}
                      {discount && <span className="badge badge-offer">-{discount}%</span>}
                      {isOutOfStock && <span className="badge badge-out-of-stock">{t("out_of_stock")}</span>}
                      {product.warranty && <span className="badge badge-warranty">{product.warranty}</span>}
                    </div>

                    {/* Brand */}
                    {product.brand && (
                      <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                        {product.brand}
                      </p>
                    )}

                    {/* Name */}
                    <h2 className="font-heading font-bold text-xl leading-snug">
                      {String(product[nameKey] || product.name_fr)}
                    </h2>

                    {/* Price */}
                    <div className="flex items-baseline gap-3">
                      <span className="price text-2xl">{product.price.toLocaleString()} {storeConfig.currency}</span>
                      {product.oldPrice && product.oldPrice > product.price && (
                        <span className="price-old text-base">{product.oldPrice.toLocaleString()}</span>
                      )}
                    </div>

                    {/* Description (truncated) */}
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                      {String(product[descKey] || product.description_fr)}
                    </p>

                    {/* Specs preview */}
                    {specs.length > 0 && (
                      <div className="grid grid-cols-2 gap-2">
                        {specs.map(([key, val]) => (
                          <div key={key} className="bg-muted rounded-lg px-3 py-2">
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{key}</p>
                            <p className="text-xs font-semibold text-foreground truncate">{val}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Tags */}
                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {tags.map((tag) => (
                          <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full border border-border text-muted-foreground">{tag}</span>
                        ))}
                      </div>
                    )}

                    {/* Quantity + cart */}
                    <div className="flex items-center gap-3 mt-auto pt-2">
                      <div className="flex items-center border border-border rounded-lg overflow-hidden">
                        <button
                          onClick={() => setQty((q) => Math.max(1, q - 1))}
                          className="w-9 h-9 flex items-center justify-center hover:bg-muted transition-colors text-lg font-bold"
                        >−</button>
                        <span className="w-10 text-center text-sm font-semibold tabular-nums">{qty}</span>
                        <button
                          onClick={() => setQty((q) => q + 1)}
                          disabled={isOutOfStock}
                          className="w-9 h-9 flex items-center justify-center hover:bg-muted transition-colors text-lg font-bold disabled:opacity-30"
                        >+</button>
                      </div>

                      <button
                        onClick={handleAddToCart}
                        disabled={isOutOfStock}
                        className="btn btn-primary flex-1 text-sm"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        {isOutOfStock ? t("out_of_stock") : t("add_to_cart")}
                      </button>

                      <button
                        onClick={handleToggleFav}
                        className={`w-10 h-10 flex items-center justify-center rounded-xl border transition-all ${
                          isFav ? "bg-red-500 border-red-500 text-white" : "border-border hover:border-accent hover:text-accent"
                        }`}
                        aria-label={t("add_to_favorites")}
                      >
                        <Heart className={`w-4 h-4 ${isFav ? "fill-current" : ""}`} />
                      </button>
                    </div>

                    {/* Full details link */}
                    <Link
                      href={`/${locale}/product/${product.id}`}
                      onClick={close}
                      className="flex items-center justify-center gap-2 text-sm text-accent hover:underline"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      {t("view_details")}
                    </Link>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
