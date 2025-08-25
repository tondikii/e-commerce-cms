import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(
  request: NextRequest,
  {params}: {params: Promise<{id: string}>}
) {
  try {
    const {id} = await params;
    const categoryId = parseInt(id);

    if (isNaN(categoryId)) {
      return NextResponse.json(
        {error: "ID kategori tidak valid"},
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

    // Check if category exists
    const category = await prisma.category.findUnique({
      where: {id: categoryId},
    });

    if (!category) {
      return NextResponse.json(
        {error: "Kategori tidak ditemukan"},
        {status: 404}
      );
    }

    // Update all products to either add or remove from category
    await prisma.product.updateMany({
      where: {
        id: {
          in: productIds,
        },
      },
      data: {
        categoryId: categoryId,
      },
    });

    // Remove category from products not in the list
    await prisma.product.updateMany({
      where: {
        categoryId: categoryId,
        id: {
          notIn: productIds,
        },
      },
      data: {
        categoryId: null,
      },
    });

    return NextResponse.json({
      message: "Produk dalam kategori berhasil diperbarui",
    });
  } catch (error) {
    console.error("Error updating category products:", error);
    return NextResponse.json(
      {error: "Gagal mengupdate produk dalam kategori"},
      {status: 500}
    );
  }
}
