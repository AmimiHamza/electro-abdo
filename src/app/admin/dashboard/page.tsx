import { prisma } from "@/lib/prisma";
import { DashboardClient } from "./DashboardClient";

async function getStats() {
  const [totalProducts, activeOffers, totalCategories, viewsAgg, recentLogs] = await Promise.all([
    prisma.product.count(),
    prisma.offer.count({ where: { isActive: true, endDate: { gt: new Date() } } }),
    prisma.category.count(),
    prisma.product.aggregate({ _sum: { viewCount: true } }),
    prisma.activityLog.findMany({ orderBy: { createdAt: "desc" }, take: 10 }),
  ]);
  return {
    totalProducts,
    activeOffers,
    totalCategories,
    totalViews: viewsAgg._sum.viewCount ?? 0,
    recentLogs: recentLogs.map((l) => ({
      ...l,
      createdAt: l.createdAt.toISOString(),
    })),
  };
}

export default async function DashboardPage() {
  const stats = await getStats().catch(() => ({
    totalProducts: 0,
    activeOffers: 0,
    totalCategories: 0,
    totalViews: 0,
    recentLogs: [],
  }));

  return <DashboardClient stats={stats} />;
}
