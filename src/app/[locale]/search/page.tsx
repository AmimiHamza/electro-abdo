import { prisma } from "@/lib/prisma";
import { getTranslations } from "next-intl/server";
import { ProductGrid } from "@/components/product/ProductGrid";
import { SortDropdown } from "@/components/filters/SortDropdown";
import { Pagination } from "@/components/ui/Pagination";
import { Search } from "lucide-react";
import type { Metadata } from "next";

const PAGE_SIZE = 12;

type SearchParams = { [key: string]: string | string[] | undefined };

function getString(val: string | string[] | undefined, fallback = ""): string {
  if (Array.isArray(val)) return val[0] ?? fallback;
  return val ?? fallback;
}

interface PageProps {
  params: { locale: string };
  searchParams: SearchParams;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const q = getString(searchParams.q);
  return { title: q ? `"${q}"` : "Recherche" };
}

export default async function SearchPage({ params, searchParams }: PageProps) {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: "search" });

  const q = getString(searchParams.q);
  const sort = getString(searchParams.sort, "popular");
  const pageParam = getString(searchParams.page, "1");
  const page = Math.max(1, parseInt(pageParam) || 1);

  const cleanSearchParams: Record<string, string> = {};
  for (const [key, val] of Object.entries(searchParams)) {
    if (typeof val === "string") cleanSearchParams[key] = val;
    else if (Array.isArray(val) && val[0]) cleanSearchParams[key] = val[0];
  }

  const where = q
    ? {
        isVisible: true,
        OR: [
          { name_fr: { contains: q } },
          { name_ar: { contains: q } },
          { name_en: { contains: q } },
          { brand: { contains: q } },
          { tags: { contains: q } },
          { description_fr: { contains: q } },
        ],
      }
    : { isVisible: true };

  const orderBy =
    sort === "price_asc" ? { price: "asc" as const } :
    sort === "price_desc" ? { price: "desc" as const } :
    sort === "newest" ? { createdAt: "desc" as const } :
    sort === "az" ? { name_fr: "asc" as const } :
    { viewCount: "desc" as const };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { images: { take: 1, orderBy: { order: "asc" } } },
      orderBy,
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }).catch(() => []),
    prisma.product.count({ where }).catch(() => 0),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

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

  return (
    <div className="container-shop py-8">
      {/* Header */}
      <div className="flex items-start gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
          <Search className="w-5 h-5 text-accent" />
        </div>
        <div>
          {q ? (
            <>
              <h1 className="font-heading text-xl font-bold">
                {total} {t("results_for")}{" "}
                <span className="text-accent">&ldquo;{q}&rdquo;</span>
              </h1>
            </>
          ) : (
            <h1 className="font-heading text-xl font-bold">
              {locale === "ar" ? "جميع المنتجات" : locale === "en" ? "All Products" : "Tous les produits"}
            </h1>
          )}
        </div>
      </div>

      {/* Sort */}
      <div className="flex justify-end mb-5">
        <SortDropdown currentSort={sort} searchParams={cleanSearchParams} />
      </div>

      {/* Grid */}
      <ProductGrid
        products={serializedProducts}
        locale={locale}
        emptyMessage={t("no_results")}
        emptySubtitle={t("no_results_subtitle")}
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
  );
}
