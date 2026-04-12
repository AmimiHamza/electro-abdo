import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/ProductForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function NewProductPage() {
  const categories = await prisma.category
    .findMany({ orderBy: { order: "asc" }, select: { id: true, name_fr: true } })
    .catch(() => []);

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/products" className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Add Product</h1>
      </div>
      <div className="admin-card">
        <ProductForm categories={categories} mode="create" />
      </div>
    </div>
  );
}
