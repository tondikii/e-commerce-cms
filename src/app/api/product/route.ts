import {NextResponse} from "next/server";
import prisma from "@/lib/prisma";
import {
  DEFAULT_LIMIT,
  DEFAULT_OFFSET,
  RESPONSE_STATUS_BAD_REQUEST,
  RESPONSE_STATUS_CREATED,
  RESPONSE_STATUS_INTERNAL_SERVER_ERROR,
  RESPONSE_STATUS_OK,
} from "@/constants";
import {Prisma} from "@prisma/client";
import {api} from "@/lib/axios";

export async function POST(request: Request) {
  try {
    const body: {
      product: Prisma.ProductCreateInput;
      images: Prisma.ProductImageCreateManyInput[];
      variants: Prisma.ProductVariantCreateManyInput[];
    } = await request.json();
    const product = await prisma.product.create({data: body.product});
    const images = body.images.map((e) => ({
      ...e,
      productId: product.id,
    }));
    const variants = body.variants.map((e) => ({
      ...e,
      productId: product.id,
    }));
    await api.post("product-image", images);
    await api.post("product-variant", variants);
    return NextResponse.json(product, {status: RESPONSE_STATUS_CREATED});
  } catch (err) {
    return NextResponse.json(err, {
      status: RESPONSE_STATUS_INTERNAL_SERVER_ERROR,
    });
  }
}

export async function GET(request: Request) {
  try {
    const {searchParams} = new URL(request.url);
    const paramsObject = Object.fromEntries(searchParams.entries());
    const {
      name = "",
      limit = DEFAULT_LIMIT,
      offset = DEFAULT_OFFSET,
      categoryId,
      collectionId,
    } = paramsObject;
    const pagination = {take: Number(limit), skip: Number(offset)};

    const where: Prisma.ProductWhereInput = {
      name: {contains: name, mode: "insensitive"},
    };

    if (categoryId) {
      where.categoryId = Number(categoryId);
    }
    if (collectionId) {
      where.collectionId = Number(collectionId);
    }

    const [data, totalRecords] = await prisma.$transaction([
      prisma.product.findMany({
        where,
        include: {
          images: {select: {url: true}},
          variants: {
            // select: {stock: true, size: {select: {code: true}}},
          },
        },
        ...pagination,
      }),
      prisma.product.count({where}),
    ]);
    return NextResponse.json(
      {data, totalRecords},
      {status: RESPONSE_STATUS_OK}
    );
  } catch (err) {
    return NextResponse.json(err, {
      status: RESPONSE_STATUS_INTERNAL_SERVER_ERROR,
    });
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

export async function PUT(request: Request) {
  try {
    const {searchParams} = new URL(request.url);
    const id = Number(Object.fromEntries(searchParams.entries())?.id);

    const body: Prisma.ProductUpdateInput = await request.json();

    const updatedProduct = await prisma.product.update({
      where: {id},
      data: body,
    });

    return NextResponse.json(updatedProduct, {status: RESPONSE_STATUS_OK});
  } catch (err) {
    return NextResponse.json(err, {
      status: RESPONSE_STATUS_INTERNAL_SERVER_ERROR,
    });
  }
}
