// app/api/products/route.ts
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.split(" ")[1];
  const user = verifyToken(token || "");

  if(user?.role !== "ADMIN"){
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { name, price, quantity, sellerName, description, images } = body;

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
        create: images?.map((url: string) => ({ url })) || [],
      },
    },
    include: {
      images: true,
    },
  });

  return NextResponse.json(product);
}

export async function GET() {
  const products = await prisma.product.findMany({
    where : {deletedAt : null},
    orderBy: { createdAt: "desc" },
    include: {
      images: true,
    },
  });

  return NextResponse.json(products);
}
