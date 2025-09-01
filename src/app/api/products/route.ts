import {NextRequest, NextResponse} from "next/server";
import {generateSku} from "@/lib/skuGenerator";
import prisma from "@/lib/prisma";
import {CreateProductRequest} from "@/types/product";
import {
  RESPONSE_STATUS_BAD_REQUEST,
  RESPONSE_STATUS_CREATED,
  RESPONSE_STATUS_INTERNAL_SERVER_ERROR,
  RESPONSE_STATUS_OK,
} from "@/constants";

export async function POST(request: NextRequest) {
  try {
    const {product, variants}: CreateProductRequest = await request.json();

    // Create product with transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create Product
      const createdProduct = await tx.product.create({
        data: {
          name: product.name,
          description: product.description,
          categoryId: product?.categoryId,
          collectionId: product?.collectionId,
        },
      });

      const images = product.images || [];

      // 2. Create Product Images
      const createdImages = await Promise.all(
        images.map((url, index) =>
          tx.productImage.create({
            data: {
              url,
              altText: product.name,
              productId: createdProduct.id,
            },
          })
        )
      );

      // 3. Create Product Variants with SKU
      const createdVariants = await Promise.all(
        variants.map(async (variant: any) => {
          const sku = generateSku(
            createdProduct.id,
            product.name,
            variant.optionValues
          );

          return tx.productVariant.create({
            data: {
              sku,
              price: variant.price,
              stock: variant.stock,
              optionValues: variant.optionValues,
              productId: createdProduct.id,
            },
          });
        })
      );

      return {createdProduct, createdImages, createdVariants};
    });

    return NextResponse.json(result, {status: RESPONSE_STATUS_CREATED});
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({error: error.message}, {status: 500});
    }

    return NextResponse.json({error: "Internal server error"}, {status: 500});
  }
}

export async function GET(request: NextRequest) {
  try {
    const {searchParams} = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "5");
    const search = searchParams.get("search");
    const noCategory = searchParams.get("noCategory");
    const noCollection = searchParams.get("noCollection");

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (search) {
      where.OR = [
        {name: {contains: search, mode: "insensitive"}},
        {description: {contains: search, mode: "insensitive"}},
      ];
    }

    if (noCategory === "true") {
      where.categoryId = null;
    }

    if (noCollection === "true") {
      where.collectionId = null;
    }

    // Get products dengan relations
    const [data, totalRecords] = await prisma.$transaction([
      prisma.product.findMany({
        where,
        include: {
          images: true,
          variants: true,
          category: {
            select: {
              name: true,
            },
          },
          collection: {
            select: {
              name: true,
            },
          },
          reviews: {
            select: {
              id: true,
              rating: true,
              comment: true,
              createdAt: true,
              user: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
            orderBy: {
              createdAt: "desc",
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.product.count({where}),
    ]);

    return NextResponse.json(
      {
        data,
        totalRecords,
      },
      {status: RESPONSE_STATUS_OK}
    );
  } catch (error) {
    return NextResponse.json({error: "Internal server error"}, {status: 500});
  }
}

export async function DELETE(request: Request) {
  try {
    const {searchParams} = new URL(request.url);
    const id = Number(Object.fromEntries(searchParams.entries())?.id);
    if (!id) {
      return NextResponse.json(
        {message: "Missing unique id to do this process"},
        {status: RESPONSE_STATUS_BAD_REQUEST}
      );
    }
    const deletedProduct = await prisma.product.delete({where: {id}});
    return NextResponse.json(deletedProduct, {status: RESPONSE_STATUS_OK});
  } catch (err) {
    return NextResponse.json(err, {
      status: RESPONSE_STATUS_INTERNAL_SERVER_ERROR,
    });
  }
}
