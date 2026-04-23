import { prisma } from "@/lib/prisma";
import { ProductsListClient } from "./ProductsListClient";

async function getProducts(search: string, page: number) {
  const limit = 20;
  const where = search
    ? {
        OR: [
          { name_fr: { contains: search, mode: "insensitive" as const } },
          { brand: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : {};

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        images: { take: 1, orderBy: { order: "asc" } },
        category: { select: { name_fr: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  return { products, total, totalPages: Math.ceil(total / limit) };
}

interface PageProps {
  searchParams: { search?: string; page?: string };
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const search = searchParams.search || "";
  const page = parseInt(searchParams.page || "1");
  const { products, total, totalPages } = await getProducts(search, page).catch(() => ({
    products: [],
    total: 0,
    totalPages: 1,
  }));

  return (
    <ProductsListClient
      products={products}
      total={total}
      totalPages={totalPages}
      page={page}
      search={search}
    />
  );
}
