import {NextResponse} from "next/server";
import {prisma} from "@/lib";
import {
  RESPONSE_STATUS_CREATED,
  RESPONSE_STATUS_INTERNAL_SERVER_ERROR,
  RESPONSE_STATUS_OK,
} from "@/constant";
import {Prisma} from "@prisma/client";

export async function POST(request: Request) {
  try {
    const body: Prisma.ProductCreateInput = await request.json();
    const product = await prisma.product.create({data: body});
    return NextResponse.json(product, {status: RESPONSE_STATUS_CREATED});
  } catch (err) {
    return NextResponse.json(
      {err},
      {status: RESPONSE_STATUS_INTERNAL_SERVER_ERROR}
    );
  }
}

export async function GET(request: Request) {
  try {
    const {searchParams} = new URL(request.url);
    // req.query
    // const paramsObject = Object.fromEntries(searchParams.entries());
    const name: string = searchParams.get("name") || "";
    const products = await prisma.product.findMany({
      where: {name: {contains: name, mode: "insensitive"}},
      include: {
        productImages: {select: {url: true}},
        productUnits: {
          select: {quantity: true, size: {select: {code: true}}},
        },
      },
    });
    return NextResponse.json(products, {status: RESPONSE_STATUS_OK});
  } catch (err) {
    return NextResponse.json(err, {
      status: RESPONSE_STATUS_INTERNAL_SERVER_ERROR,
    });
  }
}
