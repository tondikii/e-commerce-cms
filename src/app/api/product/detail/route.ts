import {
  RESPONSE_STATUS_INTERNAL_SERVER_ERROR,
  RESPONSE_STATUS_OK,
} from "@/constant";
import {prisma} from "@/lib";
import {NextResponse} from "next/server";

export async function GET(request: Request) {
  try {
    const {searchParams} = new URL(request.url);
    const id = Number(Object.fromEntries(searchParams.entries())?.id);

    const data = await prisma.$transaction([
      prisma.product.findUnique({
        where: {id},
        include: {
          productImages: {select: {url: true}},
          productUnits: {
            select: {quantity: true, size: {select: {code: true}}},
          },
        },
      }),
    ]);

    return NextResponse.json(data, {status: RESPONSE_STATUS_OK});
  } catch (err) {
    return NextResponse.json(err, {
      status: RESPONSE_STATUS_INTERNAL_SERVER_ERROR,
    });
  }
}
