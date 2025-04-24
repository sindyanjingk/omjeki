import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const token = req.headers.get("authorization")?.split(" ")[1];
  const user = verifyToken(token || "");

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { products } = await req.json(); // products: [{ productId, quantity }]

  // Cek jika produk tersedia di database
  const productIds = products.map((item: { productId: string }) => item.productId);
  const availableProducts = await prisma.product.findMany({
    where: { id: { in: productIds } },
  });

  if (availableProducts.length !== productIds.length) {
    return NextResponse.json({ error: "Some products are not available" }, { status: 400 });
  }

  // Cari cart user yang sudah ada
  let cart = await prisma.cart.findFirst({
    where: { userId: user.id },
    include: {
      items: true, // Sertakan item cart untuk memastikan produk yang sudah ada di cart
    },
  });

  // Jika cart belum ada, buat cart baru
  if (!cart) {
    cart = await prisma.cart.create({
      data: {
        userId: user.id,
        items: {
          create: products.map((item: { productId: string, quantity: number }) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        },
      },
      include: {
        items: true,
      },
    });
  } else {
    // Jika cart sudah ada, tambahkan produk ke cart yang sudah ada
    await prisma.cartItem.createMany({
      data: products.map((item: { productId: string, quantity: number }) => ({
        cartId: cart?.id,
        productId: item.productId,
        quantity: item.quantity,
      })),
    });
    
    // Refresh cart data to include new items
    cart = await prisma.cart.findFirst({
      where: { id: cart.id },
      include: {
        items: true,
      },
    });
  }

  return NextResponse.json(cart);
}

export async function GET(req: Request) {
  const token = req.headers.get("authorization")?.split(" ")[1];
  const user = verifyToken(token || "");

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cart = await prisma.cart.findFirst({
    where: { userId: user.id },
    include: {
      items: {
        include: {
          product: true, // Sertakan informasi produk dalam cart
        },
      },
    },
  });

  if (!cart) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 404 });
  }

  return NextResponse.json(cart);
}