import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { messaging } from "@/lib/firebase-admin";

export async function POST(req: NextRequest) {
  const token = req.headers.get("authorization")?.split(" ")[1];
  const user = verifyToken(token || "");

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const existUser = await prisma.user.findFirst({
    where: {
      id: user.id,
    },
  });
  if(!existUser){
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  const body = await req.json();
  const items: { productId: string; quantity: number }[] = body.items;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "No items provided" }, { status: 400 });
  }

  const productIds = items.map((i) => i.productId);
  const products = await prisma.product.findMany({
    where: {
      id: { in: productIds },
    },
  });

  if (products.length !== items.length) {
    return NextResponse.json({ error: "Some productIds are invalid" }, { status: 400 });
  }

  const total = items.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.productId);
    return sum + item.quantity * (product?.price ?? 0);
  }, 0);

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

  for (const item of items) {
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        cart: { userId: user.id },
        productId: item.productId,
      },
    });

    if (cartItem) {
      if (cartItem.quantity > item.quantity) {
        await prisma.cartItem.update({
          where: { id: cartItem.id },
          data: {
            quantity: cartItem.quantity - item.quantity,
          },
        });
      } else {
        await prisma.cartItem.delete({
          where: { id: cartItem.id },
        });
      }
    }
  }

  if (existUser.fcmToken) {
    try {
      await messaging.send({
        token: existUser.fcmToken,
        notification: {
          title: "Transaksi Berhasil",
          body: `Total belanja kamu sebesar Rp${total.toLocaleString("id-ID")}`,
        },
        data: {
          transactionId: transaction.id,
        },
      });
    } catch (err) {
      console.error("Gagal kirim notifikasi:", err);
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