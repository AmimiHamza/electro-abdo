"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useRecentlyViewedStore } from "@/stores/recentlyViewedStore";
import { storeConfig } from "@/config/store.config";

interface RecentlyViewedClientProps {
  currentProductId: string;
  locale: string;
}

export function RecentlyViewedClient({
  currentProductId,
  locale,
}: RecentlyViewedClientProps) {
  const t = useTranslations("product");
  const items = useRecentlyViewedStore((s) => s.items).filter(
    (i) => i.id !== currentProductId
  );

  if (items.length === 0) return null;

  return (
    <section className="mt-10">
      <h2 className="font-heading text-xl font-bold mb-4">{t("recently_viewed")}</h2>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
        {items.map((item) => (
          <Link
            key={item.id}
            href={`/${locale}/product/${item.id}`}
            className="card flex-shrink-0 w-36 sm:w-44 flex flex-col overflow-hidden hover:-translate-y-1 transition-all duration-300"
          >
            <div className="relative aspect-square bg-muted">
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-contain"
                  sizes="176px"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-accent/20 to-blue-400/20">
                  <span className="text-2xl font-bold font-heading text-accent/40">
                    {item.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            <div className="p-2.5">
              <p className="text-xs font-medium text-foreground line-clamp-2 leading-snug mb-1">
                {item.name}
              </p>
              <p className="text-xs font-bold text-accent">
                {item.price.toLocaleString()} {storeConfig.currency}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
