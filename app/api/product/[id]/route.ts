import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type Params = {
    params: { id: string };
};

export async function GET(req: Request, { params }: Params) {
    const product = await prisma.product.findFirst({
        where: {
            id: params.id,
            deletedAt: null, // jangan ambil yang sudah dihapus
        },
        include: {
            images: true,
        },
    });

    if (!product) {
        return NextResponse.json({ error: "Produk tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json(product);
}

export async function PUT(req: Request, { params }: Params) {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1];
    const user = verifyToken(token || "");

    if (user?.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await req.json();
    const { name, price, quantity, sellerName, description, images } = body;

    const updatedProduct = await prisma.product.update({
        where: { id: params.id },
        data: {
            name,
            price: Number(price),
            quantity: Number(quantity),
            sellerName,
            description,
        },
    });

    return NextResponse.json(updatedProduct);
}

export async function DELETE(req: Request, { params }: Params) {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1];
    const user = verifyToken(token || "");
  
    if(user?.role !== "ADMIN"){
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await prisma.product.update({
        where: { id: params.id },
        data: {
            deletedAt: new Date(), // ← soft delete
        },
    });

    return NextResponse.json({ message: "Produk berhasil dihapus (soft delete)" });
}
