import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  {params}: {params: Promise<{id: string}>}
) {
  try {
    const {id} = await params;
    const categoryId = parseInt(id);

    if (isNaN(categoryId)) {
      return NextResponse.json(
        {error: "ID kategori tidak valid"},
        {status: 400}
      );
    }

    const category = await prisma.category.findUnique({
      where: {id: categoryId},
      include: {
        products: {
          include: {
            variants: {
              select: {
                stock: true,
              },
            },
            images: {
              take: 1,
              select: {
                url: true,
              },
            },
          },
        },
      },
    });

    if (!category) {
      return NextResponse.json(
        {error: "Kategori tidak ditemukan"},
        {status: 404}
      );
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error("Error fetching category:", error);
    return NextResponse.json(
      {error: "Gagal mengambil data kategori"},
      {status: 500}
    );
  }
}

export async function PUT(
  request: NextRequest,
  {params}: {params: Promise<{id: string}>}
) {
  try {
    const {id} = await params;
    const categoryId = parseInt(id);

    if (isNaN(categoryId)) {
      return NextResponse.json(
        {error: "ID kategori tidak valid"},
        {status: 400}
      );
    }

    const body = await request.json();
    const {name} = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        {error: "Nama kategori harus diisi"},
        {status: 400}
      );
    }

    // Check if category exists
    const category = await prisma.category.findUnique({
      where: {id: categoryId},
    });

    if (!category) {
      return NextResponse.json(
        {error: "Kategori tidak ditemukan"},
        {status: 404}
      );
    }

    // Check if name already exists (excluding current category)
    const existingCategory = await prisma.category.findFirst({
      where: {
        name: {
          equals: name.trim(),
          mode: "insensitive",
        },
        id: {
          not: categoryId,
        },
      },
    });

    if (existingCategory) {
      return NextResponse.json(
        {error: "Kategori dengan nama tersebut sudah ada"},
        {status: 400}
      );
    }

    const updatedCategory = await prisma.category.update({
      where: {id: categoryId},
      data: {
        name: name.trim(),
      },
    });

    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      {error: "Gagal mengupdate kategori"},
      {status: 500}
    );
  }
}

// DELETE endpoint tetap sama
