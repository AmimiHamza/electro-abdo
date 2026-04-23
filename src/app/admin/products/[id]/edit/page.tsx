import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";
import { parseSpecs } from "@/lib/utils";
import { ProductHeader } from "../../new/ProductHeader";

interface PageProps {
  params: { id: string };
}

export default async function EditProductPage({ params }: PageProps) {
  const [product, categories] = await Promise.all([
    prisma.product
      .findUnique({
        where: { id: params.id },
        include: { images: { orderBy: { order: "asc" } } },
      })
      .catch(() => null),
    prisma.category
      .findMany({ orderBy: { order: "asc" }, select: { id: true, name_fr: true } })
      .catch(() => []),
  ]);

  if (!product) notFound();

  const defaultValues = {
    id: product.id,
    name_fr: product.name_fr,
    name_ar: product.name_ar,
    name_en: product.name_en,
    description_fr: product.description_fr,
    description_ar: product.description_ar,
    description_en: product.description_en,
    price: product.price,
    oldPrice: product.oldPrice ?? undefined,
    categoryId: product.categoryId,
    brand: product.brand ?? "",
    tags: product.tags ?? "",
    stock: product.stock,
    warranty: product.warranty ?? "",
    isNewArrival: product.isNewArrival,
    isVisible: product.isVisible,
    images: product.images.map((img) => img.url),
    specs: parseSpecs(product.specs),
  };

  return (
    <div>
      <ProductHeader titleKey="edit_product" subtitle={product.name_fr} />
      <div className="admin-card">
        <ProductForm categories={categories} defaultValues={defaultValues} mode="edit" />
      </div>
    </div>
  );
}
