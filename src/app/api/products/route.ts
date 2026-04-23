import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const search = request.nextUrl.searchParams.get("search") || "";
    const limit = parseInt(request.nextUrl.searchParams.get("limit") || "10");
    const category = request.nextUrl.searchParams.get("category");
    const sort = request.nextUrl.searchParams.get("sort") || "popular";

    const where = {
      isVisible: true,
      ...(category ? { category: { slug: category } } : {}),
      ...(search
        ? {
            OR: [
              { name_fr: { contains: search, mode: "insensitive" as const } },
              { name_ar: { contains: search, mode: "insensitive" as const } },
              { name_en: { contains: search, mode: "insensitive" as const } },
              { brand: { contains: search, mode: "insensitive" as const } },
              { tags: { contains: search, mode: "insensitive" as const } },
            ],
          }
        : {}),
    };

    const orderBy =
      sort === "price_asc"
        ? { price: "asc" as const }
        : sort === "price_desc"
        ? { price: "desc" as const }
        : sort === "newest"
        ? { createdAt: "desc" as const }
        : sort === "az"
        ? { name_fr: "asc" as const }
        : { viewCount: "desc" as const };

    const products = await prisma.product.findMany({
      where,
      include: {
        images: {
          take: 1,
          orderBy: { order: "asc" },
        },
        category: {
          select: { slug: true, name_fr: true, name_ar: true, name_en: true },
        },
      },
      take: limit,
      orderBy,
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Products API error:", error);
    return NextResponse.json([], { status: 500 });
  }
}
