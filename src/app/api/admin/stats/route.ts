import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const [
      totalProducts,
      activeOffers,
      totalCategories,
      totalViews,
      recentLogs,
    ] = await Promise.all([
      prisma.product.count(),
      prisma.offer.count({ where: { isActive: true, endDate: { gt: new Date() } } }),
      prisma.category.count(),
      prisma.product.aggregate({ _sum: { viewCount: true } }),
      prisma.activityLog.findMany({ orderBy: { createdAt: "desc" }, take: 10 }),
    ]);

    return NextResponse.json({
      totalProducts,
      activeOffers,
      totalCategories,
      totalViews: totalViews._sum.viewCount ?? 0,
      recentLogs,
    });
  } catch {
    return NextResponse.json(
      { totalProducts: 0, activeOffers: 0, totalCategories: 0, totalViews: 0, recentLogs: [] },
      { status: 500 }
    );
  }
}
