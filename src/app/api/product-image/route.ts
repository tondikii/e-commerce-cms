import {Prisma} from "@prisma/client";
import {prisma} from "@/lib";
import {
  RESPONSE_STATUS_CREATED,
  RESPONSE_STATUS_INTERNAL_SERVER_ERROR,
} from "@/constant";
import {NextResponse} from "next/server";

export async function POST(request: Request) {
  try {
    const body: Prisma.ProductImageCreateManyInput[] = await request.json();
    const productImage = await prisma.productImage.createMany({data: body});

    return NextResponse.json(productImage, {status: RESPONSE_STATUS_CREATED});
  } catch (err) {
    return NextResponse.json(err, {
      status: RESPONSE_STATUS_INTERNAL_SERVER_ERROR,
    });
  }
}
