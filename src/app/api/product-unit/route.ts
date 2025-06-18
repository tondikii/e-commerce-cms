import {Prisma} from "@prisma/client";
import {prisma} from "@/lib";
import {
  RESPONSE_STATUS_CREATED,
  RESPONSE_STATUS_INTERNAL_SERVER_ERROR,
} from "@/constant";
import {NextResponse} from "next/server";

export async function POST(request: Request) {
  try {
    const body: Prisma.ProductUnitCreateManyInput[] = await request.json();
    const productUnit = await prisma.productUnit.createMany({data: body});

    return NextResponse.json(productUnit, {status: RESPONSE_STATUS_CREATED});
  } catch (err) {
    return NextResponse.json(err, {
      status: RESPONSE_STATUS_INTERNAL_SERVER_ERROR,
    });
  }
}
