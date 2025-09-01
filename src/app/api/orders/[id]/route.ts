import {NextRequest, NextResponse} from "next/server";
import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  context: {params: Promise<{id: string}>}
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }

    const {id} = await context.params;
    const orderId = parseInt(id);
    const body = await request.json();
    const {status} = body;

    // Validasi status
    const validStatuses = [
      "PENDING",
      "PROCESSING",
      "SHIPPED",
      "DELIVERED",
      "CANCELLED",
    ];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({error: "Invalid status"}, {status: 400});
    }

    const order = await prisma.order.update({
      where: {id: orderId},
      data: {status},
      include: {
        user: true,
        items: {
          include: {
            variant: {
              include: {
                product: true,
              },
            },
          },
        },
        shippingAddress: true,
        payment: true,
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json({error: "Internal server error"}, {status: 500});
  }
}

// GET method (sudah ada)
export async function GET(
  request: NextRequest,
  context: {params: Promise<{id: string}>}
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }

    const {id} = await context.params;
    const orderId = parseInt(id);

    const order = await prisma.order.findUnique({
      where: {id: orderId},
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: {
                  include: {
                    images: true,
                  },
                },
              },
            },
          },
        },
        shippingAddress: true,
        payment: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phoneNumber: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({error: "Order not found"}, {status: 404});
    }

    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json({error: "Internal server error"}, {status: 500});
  }
}
