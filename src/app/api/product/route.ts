import {NextResponse} from "next/server";
import {prisma} from "@/lib";
import {
  DEFAULT_CATEGORY_ID,
  DEFAULT_LIMIT,
  DEFAULT_OFFSET,
  DEFAULT_STYLE_ID,
  RESPONSE_STATUS_BAD_REQUEST,
  RESPONSE_STATUS_CREATED,
  RESPONSE_STATUS_INTERNAL_SERVER_ERROR,
  RESPONSE_STATUS_OK,
} from "@/constant";
import {Prisma} from "@prisma/client";
import {api} from "@/lib/axios";

export async function POST(request: Request) {
  try {
    const body: {
      product: Prisma.ProductCreateInput;
      productImages: Prisma.ProductImageCreateManyInput[];
      productUnits: Prisma.ProductUnitCreateManyInput[];
    } = await request.json();
    const product = await prisma.product.create({data: body.product});
    const productImages = body.productImages.map((e) => ({
      ...e,
      productId: product.id,
    }));
    const productUnits = body.productUnits.map((e) => ({
      ...e,
      productId: product.id,
    }));
    await api.post("/product-image", productImages);
    await api.post("/product-unit", productUnits);
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
      styleId = DEFAULT_STYLE_ID,
      categoryId = DEFAULT_CATEGORY_ID,
    } = paramsObject;
    const pagination = {take: Number(limit), skip: Number(offset)};

    const where: Prisma.ProductWhereInput = {
      name: {contains: name, mode: "insensitive"},
      styleId: Number(styleId),
      categoryId: Number(categoryId),
    };

    const [data, totalRecords] = await prisma.$transaction([
      prisma.product.findMany({
        where,
        include: {
          productImages: {select: {url: true}},
          productUnits: {
            select: {quantity: true, size: {select: {code: true}}},
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
    console.log("ERROR TONDIKI", err);
    return NextResponse.json(err, {
      status: RESPONSE_STATUS_INTERNAL_SERVER_ERROR,
    });
  }
}
