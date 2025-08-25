import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(
  request: NextRequest,
  {params}: {params: Promise<{id: string}>}
) {
  try {
    const {id} = await params;
    const collectionId = parseInt(id);

    if (isNaN(collectionId)) {
      return NextResponse.json(
        {error: "ID koleksi tidak valid"},
        {status: 400}
      );
    }

    const body = await request.json();
    const {productIds} = body;

    if (!Array.isArray(productIds)) {
      return NextResponse.json(
        {error: "Data produk tidak valid"},
        {status: 400}
      );
    }

    // Check if collection exists
    const collection = await prisma.collection.findUnique({
      where: {id: collectionId},
    });

    if (!collection) {
      return NextResponse.json(
        {error: "Koleksi tidak ditemukan"},
        {status: 404}
      );
    }

    // Update all products to either add or remove from collection
    await prisma.product.updateMany({
      where: {
        id: {
          in: productIds,
        },
      },
      data: {
        collectionId: collectionId,
      },
    });

    // Remove collection from products not in the list
    await prisma.product.updateMany({
      where: {
        collectionId: collectionId,
        id: {
          notIn: productIds,
        },
      },
      data: {
        collectionId: null,
      },
    });

    return NextResponse.json({
      message: "Produk dalam koleksi berhasil diperbarui",
    });
  } catch (error) {
    console.error("Error updating collection products:", error);
    return NextResponse.json(
      {error: "Gagal mengupdate produk dalam koleksi"},
      {status: 500}
    );
  }
}
