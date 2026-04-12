import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
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
    });

    const result = categories.map((cat) => ({
      ...cat,
      minPrice: cat.products[0]?.price ?? null,
      products: undefined,
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error("Categories API error:", error);
    return NextResponse.json([], { status: 500 });
  }
}
