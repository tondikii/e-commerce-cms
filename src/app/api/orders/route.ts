import {NextRequest, NextResponse} from "next/server";
import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }

    const {searchParams} = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (search) {
      where.OR = [
        {orderNumber: {contains: search, mode: "insensitive"}},
        {user: {name: {contains: search, mode: "insensitive"}}},
        {user: {email: {contains: search, mode: "insensitive"}}},
      ];
    }

    if (status) {
      where.status = status;
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          payment: {
            select: {
              id: true,
              status: true,
              method: true,
            },
          },
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
        },
        orderBy: {createdAt: "desc"},
        skip,
        take: limit,
      }),
      prisma.order.count({where}),
    ]);

    return NextResponse.json({
      data: orders,
      totalRecords: total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    return NextResponse.json({error: "Internal server error"}, {status: 500});
  }
}
