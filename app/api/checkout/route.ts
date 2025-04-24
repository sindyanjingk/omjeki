import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const token = req.headers.get("authorization")?.split(" ")[1];
  const user = verifyToken(token || "");

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const items: { productId: string; quantity: number }[] = body.items;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "No items provided" }, { status: 400 });
  }

  // Ambil data produk dari DB
  const productIds = items.map((i) => i.productId);
  const products = await prisma.product.findMany({
    where: {
      id: { in: productIds },
    },
  });

  if (products.length !== items.length) {
    return NextResponse.json({ error: "Some productIds are invalid" }, { status: 400 });
  }

  // Hitung total
  const total = items.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.productId);
    return sum + item.quantity * (product?.price ?? 0);
  }, 0);

  // Simpan transaksi
  const transaction = await prisma.transaction.create({
    data: {
      userId: user.id,
      total,
      items: {
        create: items.map((item) => {
          const product = products.find((p) => p.id === item.productId);
          return {
            productId: item.productId,
            quantity: item.quantity,
            price: product?.price ?? 0,
          };
        }),
      },
    },
  });

  // Kurangi atau hapus item dari cart
  for (const item of items) {
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        cart: { userId: user.id },
        productId: item.productId,
      },
    });

    if (cartItem) {
      if (cartItem.quantity > item.quantity) {
        // Kurangi quantity
        await prisma.cartItem.update({
          where: { id: cartItem.id },
          data: {
            quantity: cartItem.quantity - item.quantity,
          },
        });
      } else {
        // Hapus dari cart kalau quantity-nya 0 atau lebih kecil
        await prisma.cartItem.delete({
          where: { id: cartItem.id },
        });
      }
    }
  }


  return NextResponse.json(transaction);
}


export async function GET(req: NextRequest) {
  const token = req.headers.get("authorization")?.split(" ")[1];
  const user = verifyToken(token || "");

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const transactions = await prisma.transaction.findMany({
    where: {
      userId: user.id,
      deletedAt: null, // exclude soft deleted
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  return NextResponse.json(transactions);
}