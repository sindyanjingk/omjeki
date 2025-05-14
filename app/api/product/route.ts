// app/api/products/route.ts
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { put } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.split(" ")[1];
  const user = verifyToken(token || "");

  const contentType = req.headers.get('content-type') || ''

  // Cek apakah Content-Type sesuai
  if (
    !contentType.includes('multipart/form-data') &&
    !contentType.includes('application/x-www-form-urlencoded')
  ) {
    return NextResponse.json(
      { error: 'Content-Type must be multipart/form-data or application/x-www-form-urlencoded' },
      { status: 400 }
    )
  }


  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (user.role !== "ADMIN" && user.role !== "DRIVER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData()
  const file = formData.get('file') as File | null

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
  }

  const blob = await put(file.name, file, {
    access: 'public',
    addRandomSuffix: true,
    allowOverwrite: true
  })
  const name = formData.get('name') as string
  const price = formData.get('price') as string
  const quantity = formData.get('quantity') as string
  const sellerName = formData.get('sellerName') as string
  const description = formData.get('description') as string
  const kabupaten = formData.get('kabupaten') as string
  const kecamatan = formData.get('kecamatan') as string
  const kelurahan = formData.get('kelurahan') as string
  const zip = formData.get('zip') as string
  const keterangan = formData.get('keterangan') as string

  if (!name || !price || !quantity || !sellerName) {
    return NextResponse.json({ error: "Field wajib diisi." }, { status: 400 });
  }

  const product = await prisma.product.create({
    data: {
      name,
      price: Number(price),
      quantity: Number(quantity),
      sellerName,
      description,
      images: {
        create: {
          url: blob.url
        }
      },
      seller : {
        create : {
          name : sellerName,
          addresses : {
            create : {
              kabupaten,
              kecamatan,
              kelurahan,
              zip,
              keterangan
            }
          }
        }
      }
    },
    include: {
      images: true,
    },
  });

  return NextResponse.json(product);
}


export async function GET() {
  const products = await prisma.product.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: "desc" },
    include: {
      images: true,
      seller: {
        include: {
          addresses: true
        }
      }
    },
  });

  return NextResponse.json(products);
}


export async function PATCH(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  const token = authHeader?.split(' ')[1];
  const user = verifyToken(token || '');

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (user.role !== "ADMIN" && user.role !== "DRIVER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const contentType = req.headers.get('content-type') || '';
  if (
    !contentType.includes('multipart/form-data') &&
    !contentType.includes('application/x-www-form-urlencoded')
  ) {
    return NextResponse.json(
      { error: 'Content-Type must be multipart/form-data or application/x-www-form-urlencoded' },
      { status: 400 }
    );
  }

  const formData = await req.formData();
  const id = formData.get('id') as string;
  if (!id) {
    return NextResponse.json({ error: "Product ID wajib diisi." }, { status: 400 });
  }

  const name = formData.get('name') as string | null;
  const price = formData.get('price') as string | null;
  const quantity = formData.get('quantity') as string | null;
  const sellerName = formData.get('sellerName') as string | null;
  const description = formData.get('description') as string | null;

  const file = formData.get('file') as File | null;

  let imageUpdateData = undefined;
  if (file) {
    const blob = await put(file.name, file, {
      access: 'public',
      addRandomSuffix: true,
      allowOverwrite: true,
    });
    imageUpdateData = {
      create: { url: blob.url },
    };
  }

  const updatedProduct = await prisma.product.update({
    where: { id },
    data: {
      name: name ?? undefined,
      price: price ? Number(price) : undefined,
      quantity: quantity ? Number(quantity) : undefined,
      sellerName: sellerName ?? undefined,
      description: description ?? undefined,
      images: imageUpdateData,
    },
    include: {
      images: true,
    },
  });

  return NextResponse.json(updatedProduct);
}


export async function DELETE(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  const token = authHeader?.split(' ')[1];
  const user = verifyToken(token || '');

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (user.role !== "ADMIN" && user.role !== "DRIVER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const id = formData.get('id') as string;

  if (!id) {
    return NextResponse.json({ error: "Product ID wajib diisi." }, { status: 400 });
  }

  const deletedProduct = await prisma.product.update({
    where: { id },
    data: {
      deletedAt: new Date(),
    },
  });

  return NextResponse.json({ message: "Product soft deleted successfully", product: deletedProduct });
}