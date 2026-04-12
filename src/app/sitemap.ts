import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { storeConfig } from "@/config/store.config";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://electroabdo.ma";
const locales = storeConfig.supportedLocales;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, products] = await Promise.all([
    prisma.category.findMany({ select: { slug: true } }).catch(() => []),
    prisma.product
      .findMany({ where: { isVisible: true }, select: { id: true, updatedAt: true } })
      .catch(() => []),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [];

  // Root pages per locale
  for (const locale of locales) {
    staticRoutes.push(
      { url: `${BASE_URL}/${locale}`, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
      { url: `${BASE_URL}/${locale}/search`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.5 },
      { url: `${BASE_URL}/${locale}/offers`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
      { url: `${BASE_URL}/${locale}/faq`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
      { url: `${BASE_URL}/${locale}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
    );
  }

  // Category pages per locale
  for (const locale of locales) {
    for (const cat of categories) {
      staticRoutes.push({
        url: `${BASE_URL}/${locale}/category/${cat.slug}`,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 0.8,
      });
    }
  }

  // Product pages per locale
  const productRoutes: MetadataRoute.Sitemap = [];
  for (const locale of locales) {
    for (const product of products) {
      productRoutes.push({
        url: `${BASE_URL}/${locale}/product/${product.id}`,
        lastModified: product.updatedAt,
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }
  }

  return [...staticRoutes, ...productRoutes];
}
