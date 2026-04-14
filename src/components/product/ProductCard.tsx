"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Eye } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCartStore } from "@/stores/cartStore";
import { useFavoritesStore } from "@/stores/favoritesStore";
import { useQuickViewStore } from "@/stores/quickViewStore";
import { useToastStore } from "@/stores/toastStore";
import { useCartDrawerStore } from "@/stores/cartDrawerStore";
import { discountPercent } from "@/lib/utils";
import { storeConfig } from "@/config/store.config";

export interface ProductCardData {
  id: string;
  name_fr: string;
  name_ar: string;
  name_en: string;
  price: number;
  oldPrice?: number | null;
  images: { url: string; order: number }[];
  stock: number;
  isNewArrival: boolean;
  warranty?: string | null;
  brand?: string | null;
  categoryId?: string;
  tags?: string | null;
}

interface ProductCardProps {
  product: ProductCardData;
  locale: string;
  compact?: boolean;
}

export function ProductCard({ product, locale, compact = false }: ProductCardProps) {
  const t = useTranslations("product");
  const tToast = useTranslations("toast");
  const addToCart = useCartStore((s) => s.addItem);
  const { toggleItem, isInFavorites } = useFavoritesStore();
  const openQuickView = useQuickViewStore((s) => s.open);
  const addToast = useToastStore((s) => s.addToast);
  const openCartDrawer = useCartDrawerStore((s) => s.open);

  const nameKey = `name_${locale}` as "name_fr" | "name_ar" | "name_en";
  const name = product[nameKey] || product.name_fr;
  const image = product.images?.[0]?.url ?? null;
  const isFav = isInFavorites(product.id);
  const isOutOfStock = product.stock === 0;
  const discount =
    product.oldPrice && product.oldPrice > product.price
      ? discountPercent(product.oldPrice, product.price)
      : null;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isOutOfStock) return;
    addToCart({
      id: product.id,
      name,
      price: product.price,
      image: image ?? "",
      categoryId: product.categoryId,
    });
    addToast({ type: "success", message: tToast("added_to_cart"), image: image ?? undefined });
    openCartDrawer();
  };

  const handleToggleFav = (e: React.MouseEvent) => {
    e.preventDefault();
    const wasAdded = toggleItem({
      id: product.id,
      name,
      price: product.price,
      oldPrice: product.oldPrice ?? undefined,
      image: image ?? "",
      categoryId: product.categoryId,
    });
    addToast({
      type: "success",
      message: wasAdded ? tToast("added_to_favorites") : tToast("removed_from_favorites"),
    });
  };

  return (
    <Link
      href={`/${locale}/product/${product.id}`}
      className={`card group flex flex-col overflow-hidden hover:-translate-y-1.5 transition-all duration-300 ${
        compact ? "w-48 sm:w-56 flex-shrink-0" : "w-full"
      }`}
    >
      {/* Image container */}
      <div className="relative aspect-square bg-muted overflow-hidden">
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-accent/20 to-blue-400/20">
            <span className="text-4xl font-bold font-heading text-accent/40">
              {name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}

        {/* Hover overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Badges overlay */}
        <div className="absolute top-2 start-2 flex flex-col gap-1">
          {product.isNewArrival && (
            <span className="badge badge-new text-[10px] animate-badge-pulse">{t("new")}</span>
          )}
          {discount && (
            <span className="badge badge-offer text-[10px] animate-badge-pulse">-{discount}%</span>
          )}
          {isOutOfStock && (
            <span className="badge badge-out-of-stock text-[10px]">
              {t("out_of_stock")}
            </span>
          )}
          {product.warranty && (
            <span className="badge badge-warranty text-[10px]">
              {product.warranty}
            </span>
          )}
        </div>

        {/* Favorite button */}
        <button
          onClick={handleToggleFav}
          aria-label={isFav ? t("remove_from_favorites") : t("add_to_favorites")}
          className={`absolute top-2 end-2 w-8 h-8 flex items-center justify-center rounded-full shadow-card transition-all duration-300 ${
            isFav
              ? "bg-red-500 text-white scale-110"
              : "bg-surface/90 text-muted-foreground hover:text-red-500 hover:bg-surface opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0"
          }`}
        >
          <Heart className={`w-4 h-4 transition-transform duration-200 ${isFav ? "fill-current scale-110" : "group-hover:scale-110"}`} />
        </button>

        {/* Quick view button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            openQuickView(product.id);
          }}
          className="absolute inset-x-0 bottom-0 flex items-center justify-center p-2.5 opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition-all duration-300"
          aria-label={t("quick_view")}
        >
          <span className="flex items-center gap-1.5 bg-white/90 dark:bg-surface/95 backdrop-blur-md text-foreground text-xs font-semibold px-4 py-2 rounded-full shadow-card-hover border border-white/50 dark:border-white/10">
            <Eye className="w-3.5 h-3.5" />
            {t("quick_view")}
          </span>
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-3 gap-2">
        {product.brand && (
          <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
            {product.brand}
          </p>
        )}
        <p className="text-sm font-semibold text-foreground line-clamp-2 leading-snug flex-1 group-hover:text-accent transition-colors duration-300">
          {name}
        </p>

        {/* Price row */}
        <div className="flex items-center gap-2">
          <span className="price text-base">
            {product.price.toLocaleString()} {storeConfig.currency}
          </span>
          {product.oldPrice && product.oldPrice > product.price && (
            <span className="price-old text-xs">
              {product.oldPrice.toLocaleString()}
            </span>
          )}
        </div>

        {/* Add to cart */}
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`btn text-xs py-2 w-full mt-auto transition-all duration-300 ${
            isOutOfStock
              ? "bg-muted text-muted-foreground cursor-not-allowed"
              : "btn-primary hover:shadow-glow"
          }`}
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          {isOutOfStock ? t("out_of_stock") : t("add_to_cart")}
        </button>
      </div>
    </Link>
  );
}
