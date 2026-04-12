import { prisma } from "@/lib/prisma";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { CategoriesGrid } from "@/components/home/CategoriesGrid";
import { OffersSection } from "@/components/home/OffersSection";
import { NewArrivals } from "@/components/home/NewArrivals";
import { TrendingNow } from "@/components/home/TrendingNow";
import { TrustedBrands } from "@/components/home/TrustedBrands";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { Testimonials } from "@/components/home/Testimonials";
import type { Metadata } from "next";
import { storeConfig } from "@/config/store.config";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const { locale } = params;
  return {
    title: storeConfig.storeName,
    description:
      storeConfig.storeTagline[locale as "fr" | "ar" | "en"] ||
      storeConfig.storeTagline.fr,
  };
}

export default async function HomePage({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = params;

  // Fetch all homepage data in parallel
  const [
    banners,
    categoriesRaw,
    offersRaw,
    newArrivals,
    trending,
    testimonials,
    brandsRaw,
  ] = await Promise.all([
    prisma.heroBanner
      .findMany({ where: { isActive: true }, orderBy: { order: "asc" } })
      .catch(() => []),

    prisma.category
      .findMany({
        include: {
          products: {
            where: { isVisible: true, stock: { gt: 0 } },
            orderBy: { price: "asc" },
            take: 1,
            select: { price: true },
          },
          _count: {
            select: { products: { where: { isVisible: true } } },
          },
        },
        orderBy: { order: "asc" },
      })
      .catch(() => []),

    prisma.offer
      .findMany({
        where: { isActive: true, endDate: { gt: new Date() } },
        take: 3,
        orderBy: { createdAt: "desc" },
      })
      .catch(() => []),

    prisma.product
      .findMany({
        where: { isVisible: true, isNewArrival: true },
        include: { images: { take: 1, orderBy: { order: "asc" } } },
        take: 12,
        orderBy: { createdAt: "desc" },
      })
      .catch(() => []),

    prisma.product
      .findMany({
        where: { isVisible: true },
        include: { images: { take: 1, orderBy: { order: "asc" } } },
        orderBy: { viewCount: "desc" },
        take: 12,
      })
      .catch(() => []),

    prisma.testimonial
      .findMany({ take: 6, orderBy: { createdAt: "desc" } })
      .catch(() => []),

    prisma.product
      .findMany({
        where: { isVisible: true, brand: { not: null } },
        select: { brand: true },
        distinct: ["brand"],
        take: 20,
      })
      .catch(() => []),
  ]);

  // Enrich categories with minPrice
  const categories = categoriesRaw.map((cat) => ({
    id: cat.id,
    name_fr: cat.name_fr,
    name_ar: cat.name_ar,
    name_en: cat.name_en,
    slug: cat.slug,
    image: cat.image,
    _count: cat._count,
    minPrice: cat.products[0]?.price ?? null,
  }));

  // Fetch products for each offer (by productIds)
  const offersWithProducts = await Promise.all(
    offersRaw.map(async (offer) => {
      const ids = offer.productIds
        .split(",")
        .map((id) => id.trim())
        .filter(Boolean)
        .slice(0, 4);

      const products =
        ids.length > 0
          ? await prisma.product
              .findMany({
                where: { id: { in: ids }, isVisible: true },
                include: { images: { take: 1, orderBy: { order: "asc" } } },
                take: 4,
              })
              .catch(() => [])
          : [];

      return {
        id: offer.id,
        title_fr: offer.title_fr,
        title_ar: offer.title_ar,
        title_en: offer.title_en,
        discount: offer.discount,
        endDate: offer.endDate.toISOString(),
        products: products.map((p) => ({
          id: p.id,
          name_fr: p.name_fr,
          name_ar: p.name_ar,
          name_en: p.name_en,
          price: p.price,
          oldPrice: p.oldPrice,
          images: p.images.map((img) => ({ url: img.url })),
        })),
      };
    })
  ).catch(() => []);

  // Serialize dates for products passed to client components
  const serializeProduct = (p: (typeof newArrivals)[0]) => ({
    id: p.id,
    name_fr: p.name_fr,
    name_ar: p.name_ar,
    name_en: p.name_en,
    price: p.price,
    oldPrice: p.oldPrice,
    images: p.images.map((img) => ({ url: img.url, order: img.order })),
    stock: p.stock,
    isNewArrival: p.isNewArrival,
    warranty: p.warranty,
    brand: p.brand,
    categoryId: p.categoryId,
    tags: p.tags,
  });

  const brands = brandsRaw
    .map((b) => b.brand)
    .filter((b): b is string => b !== null);

  return (
    <div className="min-h-screen">
      {/* 1. Hero Carousel */}
      <HeroCarousel banners={banners} locale={locale} />

      {/* 2. Categories Grid */}
      <CategoriesGrid categories={categories} locale={locale} />

      {/* 3. Offers Section (only if active offers exist) */}
      {offersWithProducts.length > 0 && (
        <OffersSection offers={offersWithProducts} locale={locale} />
      )}

      {/* 4. New Arrivals */}
      {newArrivals.length > 0 && (
        <NewArrivals
          products={newArrivals.map(serializeProduct)}
          locale={locale}
        />
      )}

      {/* 5. Trending Now */}
      {trending.length > 0 && (
        <TrendingNow
          products={trending.map(serializeProduct)}
          locale={locale}
        />
      )}

      {/* 6. Trusted Brands */}
      <TrustedBrands brands={brands} />

      {/* 7. Why Choose Us */}
      <WhyChooseUs locale={locale} />

      {/* 8. Testimonials */}
      {testimonials.length > 0 && (
        <Testimonials testimonials={testimonials} locale={locale} />
      )}
    </div>
  );
}
