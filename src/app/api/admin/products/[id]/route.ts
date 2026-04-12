import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: { images: { orderBy: { order: "asc" } }, category: true },
    });
    if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(product);
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const { images, ...data } = body;

    // Delete old images if new ones provided
    if (images) {
      await prisma.productImage.deleteMany({ where: { productId: params.id } });
    }

    const product = await prisma.product.update({
      where: { id: params.id },
      data: {
        ...data,
        ...(images
          ? {
              images: {
                create: images.map((url: string, i: number) => ({ url, order: i })),
              },
            }
          : {}),
      },
      include: { images: true },
    });

    await prisma.activityLog.create({
      data: { action: "Updated product", details: product.name_fr },
    }).catch(() => {});

    return NextResponse.json(product);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const product = await prisma.product.delete({ where: { id: params.id } });

    await prisma.activityLog.create({
      data: { action: "Deleted product", details: product.name_fr },
    }).catch(() => {});

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
