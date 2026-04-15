import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const search = request.nextUrl.searchParams.get("search") || "";
    const ids = request.nextUrl.searchParams.get("ids") || "";
    const page = parseInt(request.nextUrl.searchParams.get("page") || "1");
    const limit = parseInt(request.nextUrl.searchParams.get("limit") || "20");

    // Fetch by specific IDs (used by offer product picker)
    if (ids) {
      const idList = ids.split(",").map((id) => id.trim()).filter(Boolean);
      const products = await prisma.product.findMany({
        where: { id: { in: idList } },
        include: {
          images: { take: 1, orderBy: { order: "asc" } },
          category: { select: { name_fr: true } },
        },
      });
      return NextResponse.json({ products, total: products.length, page: 1, limit: products.length });
    }

    const where = search
      ? {
          OR: [
            { name_fr: { contains: search, mode: "insensitive" } },
            { name_en: { contains: search, mode: "insensitive" } },
            { brand: { contains: search, mode: "insensitive" } },
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

    return NextResponse.json({ products, total, page, limit });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { images, ...data } = body;

    const product = await prisma.product.create({
      data: {
        ...data,
        images: images?.length
          ? {
              create: images.map((url: string, i: number) => ({ url, order: i })),
            }
          : undefined,
      },
      include: { images: true },
    });

    // Activity log
    await prisma.activityLog.create({
      data: {
        action: "Created product",
        details: product.name_fr,
      },
    }).catch(() => {});

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
