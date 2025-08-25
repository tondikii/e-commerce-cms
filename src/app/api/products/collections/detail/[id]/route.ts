import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  {params}: {params: Promise<{id: string}>}
) {
  try {
    const {id} = await params;
    const collectionId = parseInt(id);

    if (isNaN(collectionId)) {
      return NextResponse.json(
        {error: "ID koleksi tidak valid"},
        {status: 400}
      );
    }

    const collection = await prisma.collection.findUnique({
      where: {id: collectionId},
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

    if (!collection) {
      return NextResponse.json(
        {error: "Koleksi tidak ditemukan"},
        {status: 404}
      );
    }

    return NextResponse.json(collection);
  } catch (error) {
    console.error("Error fetching collection:", error);
    return NextResponse.json(
      {error: "Gagal mengambil data koleksi"},
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
    const collectionId = parseInt(id);

    if (isNaN(collectionId)) {
      return NextResponse.json(
        {error: "ID koleksi tidak valid"},
        {status: 400}
      );
    }

    const body = await request.json();
    const {name} = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        {error: "Nama koleksi harus diisi"},
        {status: 400}
      );
    }

    // Check if collection exists
    const collection = await prisma.collection.findUnique({
      where: {id: collectionId},
    });

    if (!collection) {
      return NextResponse.json(
        {error: "Koleksi tidak ditemukan"},
        {status: 404}
      );
    }

    // Check if name already exists (excluding current collection)
    const existingCollection = await prisma.collection.findFirst({
      where: {
        name: {
          equals: name.trim(),
          mode: "insensitive",
        },
        id: {
          not: collectionId,
        },
      },
    });

    if (existingCollection) {
      return NextResponse.json(
        {error: "Koleksi dengan nama tersebut sudah ada"},
        {status: 400}
      );
    }

    const updatedCollection = await prisma.collection.update({
      where: {id: collectionId},
      data: {
        name: name.trim(),
      },
    });

    return NextResponse.json(updatedCollection);
  } catch (error) {
    console.error("Error updating collection:", error);
    return NextResponse.json(
      {error: "Gagal mengupdate koleksi"},
      {status: 500}
    );
  }
}

// DELETE endpoint tetap sama
