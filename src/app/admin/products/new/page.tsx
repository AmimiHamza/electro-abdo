import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/ProductForm";
import { ProductHeader } from "./ProductHeader";

export default async function NewProductPage() {
  const categories = await prisma.category
    .findMany({ orderBy: { order: "asc" }, select: { id: true, name_fr: true } })
    .catch(() => []);

  return (
    <div>
      <ProductHeader titleKey="new_product" />
      <div className="admin-card">
        <ProductForm categories={categories} mode="create" />
      </div>
    </div>
  );
}
