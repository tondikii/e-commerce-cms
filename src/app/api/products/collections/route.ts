import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";
import {
  RESPONSE_STATUS_BAD_REQUEST,
  RESPONSE_STATUS_INTERNAL_SERVER_ERROR,
  RESPONSE_STATUS_OK,
} from "@/constants";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {name} = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        {error: "Nama kategori harus diisi"},
        {status: 400}
      );
    }

    // Check if collection already exists
    const existingCollection = await prisma.collection.findFirst({
      where: {
        name: {
          equals: name.trim(),
          mode: "insensitive",
        },
      },
    });

    if (existingCollection) {
      return NextResponse.json(
        {error: "Kategori dengan nama tersebut sudah ada"},
        {status: 400}
      );
    }

    const collection = await prisma.collection.create({
      data: {
        name: name.trim(),
      },
    });

    return NextResponse.json(collection, {status: 201});
  } catch (error) {
    return NextResponse.json({error: "Gagal membuat kategori"}, {status: 500});
  }
}

export async function GET(request: NextRequest) {
  try {
    const {searchParams} = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";

    const skip = (page - 1) * limit;

    // Build where clause for search
    const where = search
      ? {
          name: {
            contains: search,
            mode: "insensitive" as const,
          },
        }
      : {};

    // Get categories with product count
    const [categories, totalRecords] = await Promise.all([
      prisma.collection.findMany({
        where,
        include: {
          products: {
            select: {
              id: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.collection.count({where}),
    ]);

    // Transform data to include product count
    const categoriesWithCount = categories.map((collection) => ({
      ...collection,
      products: collection?.products, // Already included from include
    }));

    return NextResponse.json({
      data: categoriesWithCount,
      totalRecords,
    });
  } catch (error) {
    return NextResponse.json(
      {error: "Gagal mengambil data kategori"},
      {status: 500}
    );
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
    const deletedCollection = await prisma.collection.delete({where: {id}});
    return NextResponse.json(deletedCollection, {status: RESPONSE_STATUS_OK});
  } catch (err) {
    return NextResponse.json(err, {
      status: RESPONSE_STATUS_INTERNAL_SERVER_ERROR,
    });
  }
}
