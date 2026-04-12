import { prisma } from "@/lib/prisma";
import { ProductCard } from "./ProductCard";

interface RelatedProductsProps {
  categoryId: string;
  currentProductId: string;
  locale: string;
  title: string;
}

export async function RelatedProducts({
  categoryId,
  currentProductId,
  locale,
  title,
}: RelatedProductsProps) {
  const products = await prisma.product
    .findMany({
      where: {
        categoryId,
        id: { not: currentProductId },
        isVisible: true,
      },
      include: { images: { take: 1, orderBy: { order: "asc" } } },
      orderBy: { viewCount: "desc" },
      take: 8,
    })
    .catch(() => []);

  if (products.length === 0) return null;

  const serialized = products.map((p) => ({
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
    <section className="mt-12">
      <h2 className="font-heading text-xl font-bold mb-5">{title}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {serialized.map((product) => (
          <ProductCard key={product.id} product={product} locale={locale} />
        ))}
      </div>
    </section>
  );
}
