import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { NextResponse } from "next/server";

type Params = { params: { id: string } };

export async function PUT(req: Request, { params }: Params) {
  const token = req.headers.get("authorization")?.split(" ")[1];
  const user = verifyToken(token || "");

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { quantity } = await req.json(); // Ambil quantity baru untuk item

  // Pastikan quantity lebih dari 0
  if (quantity <= 0) {
    return NextResponse.json({ error: "Quantity must be greater than 0" }, { status: 400 });
  }

  // Update jumlah item dalam cart
  const updatedItem = await prisma.cartItem.update({
    where: { id: params.id },
    data: { quantity },
  });

  return NextResponse.json(updatedItem);
}

export async function DELETE(req: Request, { params }: Params) {
  const token = req.headers.get("authorization")?.split(" ")[1];
  const user = verifyToken(token || "");

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Hapus produk dari cart berdasarkan ID cart item
  await prisma.cartItem.delete({
    where: { id: params.id },
  });

  return NextResponse.json({ message: "Item removed from cart" });
}
