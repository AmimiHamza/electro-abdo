"use client";

import Link from "next/link";
import { Heart, MessageCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { useFavoritesStore } from "@/stores/favoritesStore";
import { ProductCard } from "@/components/product/ProductCard";
import { whatsappUrl } from "@/lib/utils";
import { storeConfig } from "@/config/store.config";
import { useParams } from "next/navigation";

export default function FavoritesPage() {
  const params = useParams();
  const locale = (params?.locale as string) || "fr";
  const t = useTranslations("favorites");
  const items = useFavoritesStore((s) => s.items);

  const generateWhatsAppMessage = () => {
    const lines = items.map(
      (item) => `• ${item.name} — ${item.price.toLocaleString()} ${storeConfig.currency}`
    );
    const message = [
      `❤️ Ma liste de favoris — ${storeConfig.storeName}`,
      `─────────────────`,
      ...lines,
    ].join("\n");
    return whatsappUrl(storeConfig.whatsappNumber, message);
  };

  // Map favorites to ProductCardData shape (no images from DB — use what we have)
  const products = items.map((item) => ({
    id: item.id,
    name_fr: item.name,
    name_ar: item.name,
    name_en: item.name,
    price: item.price,
    oldPrice: item.oldPrice ?? null,
    images: item.image ? [{ url: item.image, order: 0 }] : [],
    stock: 1,
    isNewArrival: false,
    warranty: null,
    brand: null,
    categoryId: item.categoryId,
    tags: null,
  }));

  if (items.length === 0) {
    return (
      <div className="container-shop py-16 flex flex-col items-center justify-center gap-6 text-center min-h-[60vh]">
        <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
          <Heart className="w-12 h-12 text-muted-foreground" />
        </div>
        <div>
          <h1 className="font-heading text-2xl font-bold">{t("empty")}</h1>
          <p className="text-muted-foreground mt-2">{t("empty_subtitle")}</p>
        </div>
        <Link href={`/${locale}`} className="btn btn-primary px-8">
          {locale === "ar" ? "تسوق الآن" : locale === "en" ? "Shop Now" : "Découvrir"}
        </Link>
      </div>
    );
  }

  return (
    <div className="container-shop py-8">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold flex items-center gap-2">
            <Heart className="w-6 h-6 text-red-500 fill-current" />
            {t("title")}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">{items.length} produits</p>
        </div>
        <Link
          href={generateWhatsAppMessage()}
          target="_blank"
          rel="noopener noreferrer"
          className="btn py-2.5 px-5 text-sm bg-green-500 hover:bg-green-600 text-white flex items-center gap-2 rounded-xl font-semibold transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          {t("order_all_whatsapp")}
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} locale={locale} />
        ))}
      </div>
    </div>
  );
}
