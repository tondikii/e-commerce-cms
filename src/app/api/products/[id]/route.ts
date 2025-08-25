// src/app/api/products/[id]/route.ts
import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  {params}: {params: Promise<{id: string}>}
) {
  try {
    const {id} = await params;
    const productId = parseInt(id);

    if (isNaN(productId)) {
      return NextResponse.json({error: "ID produk tidak valid"}, {status: 400});
    }

    const product = await prisma.product.findUnique({
      where: {id: productId},
      include: {
        images: true,
        variants: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        collection: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        {error: "Produk tidak ditemukan"},
        {status: 404}
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json(
      {error: "Gagal mengambil data produk"},
      {status: 500}
    );
  }
}

export async function PUT(
  request: NextRequest,
  {params}: {params: Promise<{id: string}>}
) {
  try {
    const {id} = await params;
    const productId = parseInt(id);

    if (isNaN(productId)) {
      return NextResponse.json({error: "ID produk tidak valid"}, {status: 400});
    }

    const body = await request.json();
    const {name, description, newImages} = body;

    // Update product basic info
    const updatedProduct = await prisma.product.update({
      where: {id: productId},
      data: {
        name,
        description,
        updatedAt: new Date(),
      },
    });

    // Add new images if any
    if (newImages && newImages.length > 0) {
      await prisma.productImage.createMany({
        data: newImages.map((url: string, index: number) => ({
          url,
          altText: `${name} - Gambar ${index + 1}`,
          productId: productId,
        })),
      });
    }

    return NextResponse.json(updatedProduct);
  } catch (error) {
    return NextResponse.json({error: "Gagal mengupdate produk"}, {status: 500});
  }
}
