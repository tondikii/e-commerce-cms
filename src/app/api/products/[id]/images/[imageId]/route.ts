// src/app/api/products/[id]/images/[imageId]/route.ts
import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(
  request: NextRequest,
  {params}: {params: Promise<{id: string; imageId: string}>}
) {
  try {
    const {id, imageId} = await params;
    const productId = parseInt(id);
    const imageIdNum = parseInt(imageId);

    if (isNaN(productId) || isNaN(imageIdNum)) {
      return NextResponse.json(
        {error: "ID produk atau gambar tidak valid"},
        {status: 400}
      );
    }

    // Check if image belongs to product
    const image = await prisma.productImage.findFirst({
      where: {
        id: imageIdNum,
        productId: productId,
      },
    });

    if (!image) {
      return NextResponse.json(
        {error: "Gambar tidak ditemukan untuk produk ini"},
        {status: 404}
      );
    }

    // Delete image
    await prisma.productImage.delete({
      where: {id: imageIdNum},
    });

    return NextResponse.json({message: "Gambar berhasil dihapus"});
  } catch (error) {
    return NextResponse.json({error: "Gagal menghapus gambar"}, {status: 500});
  }
}
