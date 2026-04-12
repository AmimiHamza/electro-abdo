import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const banners = await prisma.heroBanner.findMany({ orderBy: { order: "asc" } });
    return NextResponse.json(banners);
  } catch {
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const banner = await prisma.heroBanner.create({ data: body });
    return NextResponse.json(banner, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
