import {Prisma} from "@prisma/client";
import {prisma} from "@/lib";
import {
  RESPONSE_STATUS_BAD_REQUEST,
  RESPONSE_STATUS_CREATED,
  RESPONSE_STATUS_INTERNAL_SERVER_ERROR,
  RESPONSE_STATUS_OK,
} from "@/constants";
import {NextResponse} from "next/server";

export async function POST(request: Request) {
  try {
    const body: Prisma.ProductUnitCreateManyInput[] = await request.json();

    // Insert data
    await prisma.productUnit.createMany({
      data: body,
    });

    // Ambil kembali data yang baru ditambahkan berdasarkan productId
    const productUnits = await prisma.productUnit.findMany({
      where: {
        productId: body[0]?.productId, // diasumsikan semua punya productId yang sama
      },
      orderBy: {
        id: "desc",
      },
    });

    return NextResponse.json(productUnits, {
      status: RESPONSE_STATUS_CREATED,
    });
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

    const deleted = await prisma.productUnit.deleteMany({
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
    const body: Prisma.ProductUnitCreateManyInput[] = await request.json();

    if (!Array.isArray(body) || body.length === 0) {
      return NextResponse.json(
        {message: "Missing or invalid body to update"},
        {status: RESPONSE_STATUS_BAD_REQUEST}
      );
    }

    await Promise.all(
      body.map(async (e) => {
        await prisma.productUnit.update({
          where: {id: e.id},
          data: {
            quantity: e.quantity,
            size: {connect: {id: e.sizeId}},
            color: {connect: {id: e.colorId}},
          },
        });
      })
    );

    return NextResponse.json(
      {message: "Success Update Product Units"},
      {status: RESPONSE_STATUS_OK}
    );
  } catch (err) {
    return NextResponse.json(err, {
      status: RESPONSE_STATUS_INTERNAL_SERVER_ERROR,
    });
  }
}
