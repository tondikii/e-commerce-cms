// src/app/api/products/[id]/options/route.ts
import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";

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
    const {options, variants} = body;

    // Validasi input
    if (!options || !Array.isArray(options)) {
      return NextResponse.json(
        {error: "Data options tidak valid"},
        {status: 400}
      );
    }

    if (!variants || !Array.isArray(variants)) {
      return NextResponse.json(
        {error: "Data variants tidak valid"},
        {status: 400}
      );
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: {id: productId},
    });

    if (!product) {
      return NextResponse.json(
        {error: "Produk tidak ditemukan"},
        {status: 404}
      );
    }

    // Mulai transaction untuk atomic operation
    const result = await prisma.$transaction(async (tx) => {
      // Hapus semua varian lama
      await tx.productVariant.deleteMany({
        where: {productId},
      });

      // Buat varian baru berdasarkan kombinasi options
      const newVariants = await Promise.all(
        variants.map(async (variantData: any, index: number) => {
          // Generate SKU yang unik
          const timestamp = Date.now();
          const sku = `PRD${productId}-${index + 1}-${timestamp}`;

          return await tx.productVariant.create({
            data: {
              sku,
              price: variantData.price || 0,
              stock: variantData.stock || 0,
              optionValues: variantData.optionValues || {},
              productId,
            },
          });
        })
      );

      return newVariants;
    });

    return NextResponse.json({
      message: "Options dan variants berhasil diperbarui",
      variants: result,
    });
  } catch (error) {
    return NextResponse.json(
      {error: "Gagal mengupdate pilihan varian"},
      {status: 500}
    );
  }
}

// Tambahkan juga endpoint GET untuk mengambil options
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

    // Ambil product dengan variants untuk extract options
    const product = await prisma.product.findUnique({
      where: {id: productId},
      include: {
        variants: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        {error: "Produk tidak ditemukan"},
        {status: 404}
      );
    }

    // Extract options dari variants
    const optionMap: Record<string, Set<string>> = {};

    product.variants.forEach((variant: any) => {
      if (variant.optionValues && typeof variant.optionValues === "object") {
        Object.entries(variant.optionValues).forEach(
          ([optionName, optionValue]) => {
            if (!optionMap[optionName]) {
              optionMap[optionName] = new Set();
            }
            optionMap[optionName].add(optionValue as string);
          }
        );
      }
    });

    const options = Object.entries(optionMap).map(([name, valuesSet]) => ({
      name,
      variants: Array.from(valuesSet),
    }));

    return NextResponse.json({options});
  } catch (error) {
    return NextResponse.json(
      {error: "Gagal mengambil data options"},
      {status: 500}
    );
  }
}
