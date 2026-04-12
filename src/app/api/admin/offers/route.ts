import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const offers = await prisma.offer.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json(offers);
  } catch {
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const offer = await prisma.offer.create({
      data: {
        ...body,
        startDate: new Date(body.startDate),
        endDate: new Date(body.endDate),
      },
    });
    await prisma.activityLog.create({
      data: { action: "Created offer", details: offer.title_fr },
    }).catch(() => {});
    return NextResponse.json(offer, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
