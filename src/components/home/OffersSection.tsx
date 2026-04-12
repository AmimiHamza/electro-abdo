"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { ArrowRight, Tag } from "lucide-react";
import { CountdownTimer } from "@/components/ui/CountdownTimer";
import { storeConfig } from "@/config/store.config";
import { discountPercent } from "@/lib/utils";

interface OfferProduct {
  id: string;
  name_fr: string;
  name_ar: string;
  name_en: string;
  price: number;
  oldPrice?: number | null;
  images: { url: string }[];
}

interface OfferWithProducts {
  id: string;
  title_fr: string;
  title_ar: string;
  title_en: string;
  discount?: number | null;
  endDate: string; // ISO string
  products: OfferProduct[];
}

interface OffersSectionProps {
  offers: OfferWithProducts[];
  locale: string;
}

export function OffersSection({ offers, locale }: OffersSectionProps) {
  const t = useTranslations("home");
  const tOffers = useTranslations("offers");
  const nameKey = `name_${locale}` as "name_fr" | "name_ar" | "name_en";
  const titleKey = `title_${locale}` as "title_fr" | "title_ar" | "title_en";

  if (offers.length === 0) return null;

  return (
    <section className="py-12">
      <div className="container-shop">
        {/* Section header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-accent font-semibold text-sm uppercase tracking-wider mb-1">
              {t("offers_subtitle")}
            </p>
            <h2 className="font-heading text-2xl md:text-3xl font-bold">
              {t("offers_title")}
            </h2>
          </div>
          <Link
            href={`/${locale}/offers`}
            className="flex items-center gap-1.5 text-accent text-sm font-semibold hover:gap-2.5 transition-all"
          >
            {t("see_all_offers")}
            <ArrowRight className="w-4 h-4 rtl:rotate-180" />
          </Link>
        </div>

        {/* Offers */}
        <div className="space-y-6">
          {offers.map((offer, offerIdx) => (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: offerIdx * 0.1 }}
              className="relative overflow-hidden rounded-2xl border border-border bg-surface"
            >
              {/* Gradient accent strip top */}
              <div className="gradient-strip" />

              <div className="p-5 md:p-6">
                {/* Offer header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="badge badge-offer">
                        {tOffers("active")}
                      </span>
                      {offer.discount && (
                        <span className="badge badge-offer">
                          -{offer.discount}%
                        </span>
                      )}
                    </div>
                    <h3 className="font-heading text-xl font-bold">
                      {offer[titleKey] || offer.title_fr}
                    </h3>
                  </div>
                  <CountdownTimer endDate={offer.endDate} />
                </div>

                {/* Products in offer */}
                {offer.products.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {offer.products.slice(0, 4).map((product) => {
                      const name = product[nameKey] || product.name_fr;
                      const image = product.images?.[0]?.url;
                      const discount =
                        product.oldPrice && product.oldPrice > product.price
                          ? discountPercent(product.oldPrice, product.price)
                          : offer.discount;

                      return (
                        <Link
                          key={product.id}
                          href={`/${locale}/product/${product.id}`}
                          className="group flex flex-col card overflow-hidden hover:-translate-y-1 transition-all"
                        >
                          <div className="relative aspect-square bg-muted overflow-hidden">
                            {image ? (
                              <Image
                                src={image}
                                alt={name}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                sizes="(max-width: 640px) 45vw, 25vw"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-accent/10 to-blue-400/10">
                                <Tag className="w-8 h-8 text-accent/30" />
                              </div>
                            )}
                            {discount && (
                              <span className="absolute top-2 start-2 badge badge-offer text-[10px]">
                                -{discount}%
                              </span>
                            )}
                          </div>
                          <div className="p-2.5">
                            <p className="text-xs font-medium line-clamp-2 mb-1.5 leading-snug">
                              {name}
                            </p>
                            <div className="flex items-center gap-1.5">
                              <span className="price text-sm">
                                {product.price.toLocaleString()} {storeConfig.currency}
                              </span>
                              {product.oldPrice && product.oldPrice > product.price && (
                                <span className="price-old text-[10px]">
                                  {product.oldPrice.toLocaleString()}
                                </span>
                              )}
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    {locale === "ar" ? "لا منتجات في هذا العرض" : locale === "en" ? "No products in this offer" : "Aucun produit dans cette offre"}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
