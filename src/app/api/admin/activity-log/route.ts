import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const page = parseInt(request.nextUrl.searchParams.get("page") || "1");
    const limit = parseInt(request.nextUrl.searchParams.get("limit") || "20");
    const [logs, total] = await Promise.all([
      prisma.activityLog.findMany({
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.activityLog.count(),
    ]);
    return NextResponse.json({ logs, total });
  } catch {
    return NextResponse.json({ logs: [], total: 0 }, { status: 500 });
  }
}
