import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getTranslations } from "next-intl/server";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductInfo } from "@/components/product/ProductInfo";
import { RelatedProducts } from "@/components/product/RelatedProducts";
import { RecentlyViewedClient } from "@/components/product/RecentlyViewedClient";
import { StickyAddToCart } from "@/components/product/StickyAddToCart";
import { ViewTracker } from "@/components/product/ViewTracker";
import { parseSpecs } from "@/lib/utils";

interface PageProps {
  params: { locale: string; id: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const product = await prisma.product
    .findUnique({
      where: { id: params.id },
      include: { images: { take: 1, orderBy: { order: "asc" } } },
    })
    .catch(() => null);
  if (!product) return {};

  const name =
    params.locale === "ar"
      ? product.name_ar
      : params.locale === "en"
      ? product.name_en
      : product.name_fr;

  const description =
    params.locale === "ar"
      ? product.description_ar
      : params.locale === "en"
      ? product.description_en
      : product.description_fr;

  const image = product.images[0]?.url;

  return {
    title: name,
    description: description.slice(0, 160),
    openGraph: {
      title: name,
      description: description.slice(0, 160),
      type: "website",
      ...(image ? { images: [{ url: image, width: 600, height: 600, alt: name }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: name,
      description: description.slice(0, 160),
      ...(image ? { images: [image] } : {}),
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { locale, id } = params;
  const t = await getTranslations({ locale, namespace: "product" });
  const tNav = await getTranslations({ locale, namespace: "nav" });

  const product = await prisma.product
    .findUnique({
      where: { id },
      include: {
        images: { orderBy: { order: "asc" } },
        category: true,
      },
    })
    .catch(() => null);

  if (!product || !product.isVisible) notFound();

  const nameKey = locale === "ar" ? "name_ar" : locale === "en" ? "name_en" : "name_fr";
  const descKey =
    locale === "ar"
      ? "description_ar"
      : locale === "en"
      ? "description_en"
      : "description_fr";
  const catNameKey =
    locale === "ar" ? "name_ar" : locale === "en" ? "name_en" : "name_fr";

  const name = product[nameKey];
  const description = product[descKey];
  const categoryName = product.category[catNameKey];

  // Serialize product for client components (no Date objects)
  const serializedProduct = {
    id: product.id,
    name_fr: product.name_fr,
    name_ar: product.name_ar,
    name_en: product.name_en,
    price: product.price,
    oldPrice: product.oldPrice,
    stock: product.stock,
    isNewArrival: product.isNewArrival,
    warranty: product.warranty,
    brand: product.brand,
    tags: product.tags,
    categoryId: product.categoryId,
    images: product.images.map((img) => ({ url: img.url, order: img.order })),
    category: {
      name_fr: product.category.name_fr,
      name_ar: product.category.name_ar,
      name_en: product.category.name_en,
      slug: product.category.slug,
    },
  };

  const specs = parseSpecs(product.specs);

  const firstImage =
    product.images.find((i) => i.order === 0)?.url ?? product.images[0]?.url ?? "";

  const breadcrumbs = [
    { label: tNav("home"), href: `/${locale}` },
    {
      label: categoryName,
      href: `/${locale}/category/${product.category.slug}`,
    },
    { label: name },
  ];

  // Escape description for safe HTML render (basic)
  const descriptionHtml = description
    ? description
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\n\n/g, "</p><p>")
        .replace(/\n/g, "<br />")
        .replace(/^/, "<p>")
        .replace(/$/, "</p>")
    : "";

  return (
    <>
      {/* Track view (client-side) */}
      <ViewTracker
        productId={product.id}
        productName={name}
        price={product.price}
        image={firstImage}
      />

      {/* Mobile sticky add-to-cart */}
      <StickyAddToCart
        productId={product.id}
        productName={name}
        price={product.price}
        image={firstImage}
        stock={product.stock}
        categoryId={product.categoryId}
      />

      <div className="container-shop py-6">
        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbs} />

        {/* Two-column layout */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* LEFT: Gallery */}
          <div className="md:sticky md:top-24">
            <ProductGallery
              images={serializedProduct.images}
              productName={name}
            />
          </div>

          {/* RIGHT: Product info + tabs */}
          <div>
            <ProductInfo
              product={serializedProduct}
              locale={locale}
              descriptionHtml={descriptionHtml}
              specs={specs}
            />
          </div>
        </div>

        {/* Related products */}
        <RelatedProducts
          categoryId={product.categoryId}
          currentProductId={product.id}
          locale={locale}
          title={t("related_products")}
        />

        {/* Recently viewed (client — from localStorage) */}
        <RecentlyViewedClient
          currentProductId={product.id}
          locale={locale}
        />
      </div>
    </>
  );
}
