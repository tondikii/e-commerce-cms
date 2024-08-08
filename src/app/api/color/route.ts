import {NextResponse} from "next/server";
import {prisma} from "@/lib";
import {
  RESPONSE_STATUS_INTERNAL_SERVER_ERROR,
  RESPONSE_STATUS_OK,
} from "@/constant";

export async function GET() {
  try {
    const colors = await prisma.color.findMany();
    return NextResponse.json(colors, {status: RESPONSE_STATUS_OK});
  } catch (err) {
    return NextResponse.json(err, {
      status: RESPONSE_STATUS_INTERNAL_SERVER_ERROR,
    });
  }
}
