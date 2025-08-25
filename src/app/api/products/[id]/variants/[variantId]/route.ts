// src/app/api/products/[id]/variants/[variantId]/route.ts
import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(
  request: NextRequest,
  {params}: {params: Promise<{id: string; variantId: string}>}
) {
  try {
    const {id, variantId} = await params;
    const productId = parseInt(id);
    const variantIdNum = parseInt(variantId);

    if (isNaN(productId) || isNaN(variantIdNum)) {
      return NextResponse.json(
        {error: "ID produk atau varian tidak valid"},
        {status: 400}
      );
    }

    const body = await request.json();
    const {price, stock} = body;

    // Check if variant belongs to product
    const variant = await prisma.productVariant.findFirst({
      where: {
        id: variantIdNum,
        productId: productId,
      },
    });

    if (!variant) {
      return NextResponse.json(
        {error: "Varian tidak ditemukan untuk produk ini"},
        {status: 404}
      );
    }

    // Update variant
    const updatedVariant = await prisma.productVariant.update({
      where: {id: variantIdNum},
      data: {
        price,
        stock,
      },
    });

    return NextResponse.json(updatedVariant);
  } catch (error) {
    return NextResponse.json({error: "Gagal mengupdate varian"}, {status: 500});
  }
}
