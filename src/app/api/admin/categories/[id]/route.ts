import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const category = await prisma.category.update({ where: { id: params.id }, data: body });
    return NextResponse.json(category);
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const count = await prisma.product.count({ where: { categoryId: params.id } });
    if (count > 0) {
      return NextResponse.json(
        { error: `Cannot delete: ${count} products in this category` },
        { status: 400 }
      );
    }
    await prisma.category.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
