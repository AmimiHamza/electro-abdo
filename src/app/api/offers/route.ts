import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const offers = await prisma.offer.findMany({
      where: {
        isActive: true,
        endDate: { gt: new Date() },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(
      offers.map((o) => ({
        ...o,
        startDate: o.startDate.toISOString(),
        endDate: o.endDate.toISOString(),
        createdAt: o.createdAt.toISOString(),
      }))
    );
  } catch (error) {
    console.error("Offers API error:", error);
    return NextResponse.json([], { status: 500 });
  }
}
