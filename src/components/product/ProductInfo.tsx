"use client";

import { useState } from "react";
import { ShoppingCart, Heart, Minus, Plus, MessageCircle, Shield, Truck } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCartStore } from "@/stores/cartStore";
import { useFavoritesStore } from "@/stores/favoritesStore";
import { useToastStore } from "@/stores/toastStore";
import { useCartDrawerStore } from "@/stores/cartDrawerStore";
import { discountPercent, whatsappUrl, parseTags } from "@/lib/utils";
import { storeConfig } from "@/config/store.config";
import { ShareButton } from "./ShareButton";
import { SpecsTable } from "./SpecsTable";
import Link from "next/link";

interface ProductInfoProps {
  product: {
    id: string;
    name_fr: string;
    name_ar: string;
    name_en: string;
    price: number;
    oldPrice?: number | null;
    stock: number;
    isNewArrival: boolean;
    warranty?: string | null;
    brand?: string | null;
    tags?: string | null;
    categoryId: string;
    images: { url: string; order: number }[];
    category: { name_fr: string; name_ar: string; name_en: string; slug: string };
  };
  locale: string;
  descriptionHtml: string;
  specs: Record<string, string>;
}

export function ProductInfo({ product, locale, descriptionHtml, specs }: ProductInfoProps) {
  const t = useTranslations("product");
  const tToast = useTranslations("toast");
  const hasSpecs = Object.keys(specs).length > 0;
  const addToast = useToastStore((s) => s.addToast);
  const openCartDrawer = useCartDrawerStore((s) => s.open);
  const addToCart = useCartStore((s) => s.addItem);
  const { toggleItem, isInFavorites } = useFavoritesStore();

  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState<"description" | "specs" | "delivery">("description");

  const nameKey = `name_${locale}` as "name_fr" | "name_ar" | "name_en";
  const name = product[nameKey] || product.name_fr;
  const image = product.images.find((i) => i.order === 0)?.url ?? product.images[0]?.url ?? "";
  const isFav = isInFavorites(product.id);
  const isOutOfStock = product.stock === 0;
  const discount =
    product.oldPrice && product.oldPrice > product.price
      ? discountPercent(product.oldPrice, product.price)
      : null;
  const tags = parseTags(product.tags);

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    for (let i = 0; i < qty; i++) {
      addToCart({
        id: product.id,
        name,
        price: product.price,
        image,
        categoryId: product.categoryId,
      });
    }
    addToast({ type: "success", message: tToast("added_to_cart"), image: image || undefined });
    openCartDrawer();
  };

  const handleToggleFav = () => {
    const wasAdded = toggleItem({
      id: product.id,
      name,
      price: product.price,
      oldPrice: product.oldPrice ?? undefined,
      image,
      categoryId: product.categoryId,
    });
    addToast({
      type: "success",
      message: wasAdded ? tToast("added_to_favorites") : tToast("removed_from_favorites"),
    });
  };

  const whatsappMessage =
    locale === "ar"
      ? `مرحباً، أريد طلب: ${name}\nالسعر: ${product.price.toLocaleString()} ${storeConfig.currency}`
      : locale === "en"
      ? `Hello, I want to order: ${name}\nPrice: ${product.price.toLocaleString()} ${storeConfig.currency}`
      : `Bonjour, je voudrais commander : ${name}\nPrix : ${product.price.toLocaleString()} ${storeConfig.currency}`;

  const tabs = [
    { id: "description" as const, label: t("description") },
    { id: "specs" as const, label: t("specifications") },
    { id: "delivery" as const, label: t("delivery") },
  ];

  return (
    <div className="flex flex-col gap-5">
      {/* Brand */}
      {product.brand && (
        <p className="text-xs font-semibold uppercase tracking-widest text-accent">
          {product.brand}
        </p>
      )}

      {/* Name */}
      <h1 className="font-heading text-2xl md:text-3xl font-bold leading-snug">
        {name}
      </h1>

      {/* Badges row */}
      <div className="flex flex-wrap gap-2">
        {product.isNewArrival && (
          <span className="badge badge-new text-xs">{t("new")}</span>
        )}
        {discount && (
          <span className="badge badge-offer text-xs">-{discount}%</span>
        )}
        {product.warranty && (
          <span className="flex items-center gap-1 badge badge-warranty text-xs">
            <Shield className="w-3 h-3" />
            {product.warranty}
          </span>
        )}
        {isOutOfStock ? (
          <span className="badge badge-out-of-stock text-xs">{t("out_of_stock")}</span>
        ) : (
          <span className="flex items-center gap-1 text-xs font-semibold text-green-600 dark:text-green-400">
            <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
            {t("in_stock")} ({product.stock})
          </span>
        )}
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-3">
        <span className="price text-3xl font-bold">
          {product.price.toLocaleString()} {storeConfig.currency}
        </span>
        {product.oldPrice && product.oldPrice > product.price && (
          <span className="price-old text-lg">
            {product.oldPrice.toLocaleString()} {storeConfig.currency}
          </span>
        )}
      </div>

      {/* Quantity + Add to cart */}
      <div className="flex flex-col gap-3">
        {/* Quantity selector */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">{t("quantity")}</span>
          <div className="flex items-center border border-border rounded-lg overflow-hidden">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="w-9 h-9 flex items-center justify-center hover:bg-muted transition-colors"
              disabled={qty <= 1}
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-10 text-center text-sm font-semibold">{qty}</span>
            <button
              onClick={() => setQty((q) => Math.min(product.stock || 99, q + 1))}
              className="w-9 h-9 flex items-center justify-center hover:bg-muted transition-colors"
              disabled={isOutOfStock || qty >= product.stock}
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`flex-1 btn text-sm py-3 ${
              isOutOfStock
                ? "bg-muted text-muted-foreground cursor-not-allowed"
                : "btn-primary"
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            {isOutOfStock ? t("out_of_stock") : t("add_to_cart")}
          </button>

          <button
            onClick={handleToggleFav}
            aria-label={isFav ? t("remove_from_favorites") : t("add_to_favorites")}
            className={`btn py-3 px-4 ${
              isFav
                ? "bg-red-500 text-white hover:bg-red-600"
                : "btn-outline"
            }`}
          >
            <Heart className={`w-4 h-4 ${isFav ? "fill-current" : ""}`} />
          </button>
        </div>

        {/* WhatsApp order */}
        <Link
          href={whatsappUrl(storeConfig.whatsappNumber, whatsappMessage)}
          target="_blank"
          rel="noopener noreferrer"
          className="btn py-3 text-sm bg-green-500 hover:bg-green-600 text-white flex items-center justify-center gap-2 rounded-xl font-semibold transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          {locale === "ar"
            ? "اطلب عبر واتساب"
            : locale === "en"
            ? "Order via WhatsApp"
            : "Commander via WhatsApp"}
        </Link>
      </div>

      {/* Share */}
      <div className="flex items-center justify-between pt-1 border-t border-border">
        <ShareButton productName={name} price={product.price} />
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 justify-end">
            {tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Delivery teaser */}
      <div className="flex items-start gap-2 rounded-xl bg-muted/50 p-3 text-sm">
        <Truck className="w-4 h-4 text-accent mt-0.5 shrink-0" />
        <p className="text-muted-foreground leading-relaxed">
          {storeConfig.deliveryInfo[locale as "fr" | "ar" | "en"]}
        </p>
      </div>

      {/* Tabs — description / specs / delivery */}
      <div className="border-t border-border pt-5">
        <div className="flex gap-1 border-b border-border mb-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px ${
                activeTab === tab.id
                  ? "border-accent text-accent"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="text-sm leading-relaxed text-muted-foreground">
          {activeTab === "description" && (
            <div
              className="prose prose-sm dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: descriptionHtml }}
            />
          )}
          {activeTab === "specs" && (
            hasSpecs ? (
              <SpecsTable specs={specs} />
            ) : (
              <p className="italic">
                {locale === "ar"
                  ? "لا توجد مواصفات متاحة."
                  : locale === "en"
                  ? "No specifications available."
                  : "Aucune spécification disponible."}
              </p>
            )
          )}
          {activeTab === "delivery" && (
            <div className="space-y-3">
              <p>{storeConfig.deliveryInfo[locale as "fr" | "ar" | "en"]}</p>
              <p>{storeConfig.returnPolicy[locale as "fr" | "ar" | "en"]}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
