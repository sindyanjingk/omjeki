import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const token = req.headers.get("authorization")?.split(" ")[1];
  const user = verifyToken(token || "");

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { products } = await req.json(); // products: [{ productId, quantity }]

  const productIds = products.map((item: { productId: string }) => item.productId);
  const availableProducts = await prisma.product.findMany({
    where: { id: { in: productIds } },
  });

  if (availableProducts.length !== productIds.length) {
    return NextResponse.json({ error: "Some products are not available" }, { status: 400 });
  }

  let cart = await prisma.cart.findFirst({
    where: { userId: user.id },
    include: { items: true },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: {
        userId: user.id,
        items: {
          create: products.map((item: { productId: string; quantity: number }) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        },
      },
      include: { items: true },
    });
  } else {
    for (const item of products) {
      const existingItem = cart.items.find(ci => ci.productId === item.productId);

      if (existingItem) {
        // Update quantity jika produk sudah ada di cart
        await prisma.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: existingItem.quantity + item.quantity },
        });
      } else {
        // Tambahkan item baru ke cart
        await prisma.cartItem.create({
          data: {
            cartId: cart.id,
            productId: item.productId,
            quantity: item.quantity,
          },
        });
      }
    }

    // Refresh cart data
    cart = await prisma.cart.findFirst({
      where: { id: cart.id },
      include: { items: true },
    });
  }

  return NextResponse.json(cart);
}


export async function GET(req: NextRequest) {
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
          product: {
            include : {
              images : true
            }
          }
        },
      },
    },
  });

  if (!cart) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 404 });
  }

  return NextResponse.json(cart);
}