import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getTranslations } from "next-intl/server";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { FilterSidebar } from "@/components/filters/FilterSidebar";
import { SortDropdown } from "@/components/filters/SortDropdown";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Pagination } from "@/components/ui/Pagination";
import { parseTags } from "@/lib/utils";

const PAGE_SIZE = 12;

type SearchParams = { [key: string]: string | string[] | undefined };

function getString(val: string | string[] | undefined, fallback = ""): string {
  if (Array.isArray(val)) return val[0] ?? fallback;
  return val ?? fallback;
}

interface PageProps {
  params: { locale: string; slug: string };
  searchParams: SearchParams;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const category = await prisma.category
    .findUnique({ where: { slug: params.slug } })
    .catch(() => null);
  if (!category) return {};
  const name =
    params.locale === "ar"
      ? category.name_ar
      : params.locale === "en"
      ? category.name_en
      : category.name_fr;
  return { title: name };
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const { locale, slug } = params;
  const t = await getTranslations({ locale, namespace: "filters" });
  const tNav = await getTranslations({ locale, namespace: "nav" });

  // Parse search params (all server-side — no useSearchParams)
  const sort = getString(searchParams.sort, "popular");
  const brandsParam = getString(searchParams.brands);
  const tagsParam = getString(searchParams.tags);
  const minParam = getString(searchParams.min);
  const maxParam = getString(searchParams.max);
  const stockParam = getString(searchParams.stock);
  const pageParam = getString(searchParams.page, "1");

  const selectedBrands = brandsParam ? brandsParam.split(",").filter(Boolean) : [];
  const selectedTags = tagsParam ? tagsParam.split(",").filter(Boolean) : [];
  const minPrice = minParam ? parseFloat(minParam) : undefined;
  const maxPrice = maxParam ? parseFloat(maxParam) : undefined;
  const inStockOnly = stockParam === "1";
  const page = Math.max(1, parseInt(pageParam) || 1);

  // Fetch category
  const category = await prisma.category
    .findUnique({ where: { slug } })
    .catch(() => null);
  if (!category) notFound();

  const nameKey =
    locale === "ar" ? "name_ar" : locale === "en" ? "name_en" : "name_fr";
  const categoryName = category[nameKey];

  // Build Prisma where clause
  const baseWhere = { categoryId: category.id, isVisible: true };
  const filterWhere = {
    AND: [
      baseWhere,
      ...(inStockOnly ? [{ stock: { gt: 0 } }] : []),
      ...(selectedBrands.length > 0 ? [{ brand: { in: selectedBrands } }] : []),
      ...(minPrice !== undefined ? [{ price: { gte: minPrice } }] : []),
      ...(maxPrice !== undefined ? [{ price: { lte: maxPrice } }] : []),
      ...(selectedTags.length > 0
        ? [{ OR: selectedTags.map((tag) => ({ tags: { contains: tag } })) }]
        : []),
    ],
  };

  const orderBy =
    sort === "price_asc" ? { price: "asc" as const } :
    sort === "price_desc" ? { price: "desc" as const } :
    sort === "newest" ? { createdAt: "desc" as const } :
    sort === "az" ? { name_fr: "asc" as const } :
    { viewCount: "desc" as const };

  // Fetch products + total (parallel)
  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where: filterWhere,
      include: { images: { take: 1, orderBy: { order: "asc" } } },
      orderBy,
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }).catch(() => []),
    prisma.product.count({ where: filterWhere }).catch(() => 0),
  ]);

  // Fetch all products in this category for filter options
  const allCategoryProducts = await prisma.product
    .findMany({
      where: baseWhere,
      select: { brand: true, tags: true, price: true },
    })
    .catch(() => []);

  const availableBrands = Array.from(
    new Set(
      allCategoryProducts.map((p) => p.brand).filter((b): b is string => !!b)
    )
  ).sort();

  const availableTags = Array.from(
    new Set(allCategoryProducts.flatMap((p) => parseTags(p.tags)))
  ).sort();

  const prices = allCategoryProducts.map((p) => p.price);
  const priceRange = {
    min: prices.length > 0 ? Math.min(...prices) : 0,
    max: prices.length > 0 ? Math.max(...prices) : 0,
  };

  const totalPages = Math.ceil(total / PAGE_SIZE);

  // Serialise products for client components
  const serializedProducts = products.map((p) => ({
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
  }));

  // Clean searchParams for passing to client components (only string values)
  const cleanSearchParams: Record<string, string> = {};
  for (const [key, val] of Object.entries(searchParams)) {
    if (typeof val === "string") cleanSearchParams[key] = val;
    else if (Array.isArray(val) && val[0]) cleanSearchParams[key] = val[0];
  }

  const breadcrumbs = [
    { label: tNav("home"), href: `/${locale}` },
    { label: categoryName },
  ];

  return (
    <div className="container-shop py-6">
      {/* Breadcrumbs */}
      <Breadcrumbs items={breadcrumbs} />

      {/* Category header */}
      <div className="mt-4 mb-6">
        <h1 className="font-heading text-2xl md:text-3xl font-bold">
          {categoryName}
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          {t("showing")} {total} {t("products")}
        </p>
      </div>

      <div className="flex gap-6 items-start">
        {/* Filter sidebar (desktop: sticky left | mobile: drawer via button) */}
        <FilterSidebar
          currentSort={sort}
          selectedBrands={selectedBrands}
          selectedTags={selectedTags}
          currentMinPrice={minPrice}
          currentMaxPrice={maxPrice}
          inStockOnly={inStockOnly}
          availableBrands={availableBrands}
          availableTags={availableTags}
          priceRange={priceRange}
          searchParams={cleanSearchParams}
        />

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Toolbar: sort dropdown (mobile filter button is inside FilterSidebar above grid) */}
          <div className="flex items-center justify-end gap-3 mb-5">
            <SortDropdown
              currentSort={sort}
              searchParams={cleanSearchParams}
            />
          </div>

          {/* Product grid */}
          <ProductGrid
            products={serializedProducts}
            locale={locale}
            emptyMessage={
              locale === "ar"
                ? "لا توجد منتجات"
                : locale === "en"
                ? "No products found"
                : "Aucun produit trouvé"
            }
            emptySubtitle={
              locale === "ar"
                ? "جرّب تغيير الفلاتر"
                : locale === "en"
                ? "Try adjusting your filters"
                : "Essayez de modifier vos filtres"
            }
          />

          {/* Pagination */}
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            total={total}
            pageSize={PAGE_SIZE}
            searchParams={cleanSearchParams}
          />
        </div>
      </div>
    </div>
  );
}
