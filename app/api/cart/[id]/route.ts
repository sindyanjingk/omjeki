import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

type Params = Promise<{ id: string }>;

export async function PUT(req: NextRequest, { params }: { params: Params }) {
  const { id } =  await params;
  const token = req.headers.get("authorization")?.split(" ")[1];
  const user = verifyToken(token || "");

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { quantity } = await req.json(); // Ambil quantity baru untuk item

  // Pastikan quantity lebih dari 0
  if (quantity <= 0) {
    return NextResponse.json({ error: "Kuantity harus lebih besar dari 0" }, { status: 400 });
  }
  const cartItem = await prisma.cartItem.findUnique({
    where: { id },
  });

  if (!cartItem) {
    return NextResponse.json({ error: "Keranjang tidak ditemukan" }, { status: 404 });
  }

  const product = await prisma.product.findUnique({
    where: { id: cartItem.productId },
  });
  if(!product) {
    return NextResponse.json({ error: "Produk tidak ditemukan" }, { status: 404 });
  }
  if(product.quantity < quantity) {
    return NextResponse.json({ error: "Stok product tidak cukup" }, { status: 400 });
  }
  // Update jumlah item dalam cart
  const updatedItem = await prisma.cartItem.update({
    where: { id },
    data: { quantity },
  });

  return NextResponse.json(updatedItem);
}

export async function DELETE(req: NextRequest, { params }: { params: Params }) {
  const { id } =  await params;
  const token = req.headers.get("authorization")?.split(" ")[1];
  const user = verifyToken(token || "");

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Hapus produk dari cart berdasarkan ID cart item
  await prisma.cartItem.delete({
    where: { id },
  });

  return NextResponse.json({ message: "Item removed from cart" });
}
