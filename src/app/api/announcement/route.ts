import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const announcement = await prisma.announcement.findFirst({
      where: { isActive: true },
    });
    return NextResponse.json(announcement);
  } catch {
    return NextResponse.json(null);
  }
}
