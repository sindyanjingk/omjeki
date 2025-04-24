import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const token = req.headers.get("authorization")?.split(" ")[1];
  const user = verifyToken(token || "");

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Ambil cart user
  const cart = await prisma.cart.findFirst({
    where: { userId: user.id },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!cart || cart.items.length === 0) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }

  // Hitung total harga
  const total = cart.items.reduce((sum, item) => {
    return sum + item.quantity * (item.product.price ?? 0);
  }, 0);

  // Buat transaksi
  const transaction = await prisma.transaction.create({
    data: {
      userId: user.id,
      total,
      items: {
        create: cart.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.product.price ?? 0,
        })),
      },
    },
  });

  // Hapus cart items (kosongkan cart)
  await prisma.cartItem.deleteMany({
    where: {
      cartId: cart.id,
    },
  });

  return NextResponse.json(transaction);
}

export async function GET(req: Request) {
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