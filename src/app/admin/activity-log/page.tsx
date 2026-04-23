import { prisma } from "@/lib/prisma";
import { ActivityLogClient } from "./ActivityLogClient";

interface PageProps {
  searchParams: { page?: string };
}

const LIMIT = 25;

export default async function ActivityLogPage({ searchParams }: PageProps) {
  const page = parseInt(searchParams.page || "1");

  const [logs, total] = await Promise.all([
    prisma.activityLog.findMany({
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * LIMIT,
      take: LIMIT,
    }).catch(() => []),
    prisma.activityLog.count().catch(() => 0),
  ]);

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <ActivityLogClient
      logs={logs.map((l) => ({
        ...l,
        createdAt: l.createdAt.toISOString(),
      }))}
      total={total}
      totalPages={totalPages}
      page={page}
    />
  );
}
