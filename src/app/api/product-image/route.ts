import {Prisma} from "@prisma/client";
import prisma from "@/lib/prisma";
import {
  RESPONSE_STATUS_BAD_REQUEST,
  RESPONSE_STATUS_CREATED,
  RESPONSE_STATUS_INTERNAL_SERVER_ERROR,
  RESPONSE_STATUS_OK,
} from "@/constants";
import {NextResponse} from "next/server";

export async function POST(request: Request) {
  try {
    const body: Prisma.ProductImageCreateManyInput[] = await request.json();

    // Create tanpa return
    await prisma.productImage.createMany({
      data: body,
    });

    // Fetch data yang baru ditambahkan
    const productImages = await prisma.productImage.findMany({
      where: {
        productId: body[0].productId,
      },
      orderBy: {
        id: "desc",
      },
    });

    return NextResponse.json(productImages, {status: RESPONSE_STATUS_CREATED});
  } catch (err) {
    return NextResponse.json(err, {
      status: RESPONSE_STATUS_INTERNAL_SERVER_ERROR,
    });
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const {ids}: {ids: number[]} = body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        {message: "Missing or invalid ids to delete"},
        {status: RESPONSE_STATUS_BAD_REQUEST}
      );
    }

    const deleted = await prisma.productImage.deleteMany({
      where: {id: {in: ids}},
    });

    return NextResponse.json(deleted, {status: RESPONSE_STATUS_OK});
  } catch (err) {
    return NextResponse.json(err, {
      status: RESPONSE_STATUS_INTERNAL_SERVER_ERROR,
    });
  }
}

export async function PUT(request: Request) {
  try {
    const body: Prisma.ProductImageCreateManyInput[] = await request.json();

    if (!Array.isArray(body) || body.length === 0) {
      return NextResponse.json(
        {message: "Missing or invalid body to update"},
        {status: RESPONSE_STATUS_BAD_REQUEST}
      );
    }

    await Promise.all(
      body.map(async (e) => {
        await prisma.productImage.update({
          where: {id: e.id},
          data: {url: e.url},
        });
      })
    );

    return NextResponse.json(
      {message: "Success Update Product Images"},
      {status: RESPONSE_STATUS_OK}
    );
  } catch (err) {
    return NextResponse.json(err, {
      status: RESPONSE_STATUS_INTERNAL_SERVER_ERROR,
    });
  }
}
