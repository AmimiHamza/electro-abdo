import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";
import { parseSpecs } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

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
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/products" className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Product</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{product.name_fr}</p>
        </div>
      </div>
      <div className="admin-card">
        <ProductForm categories={categories} defaultValues={defaultValues} mode="edit" />
      </div>
    </div>
  );
}
