import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const token = req.headers.get("authorization")?.split(" ")[1];
    const user = verifyToken(token || "");

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { productId, rating, comment } = await req.json();
        const review = await prisma.review.create({
            data: {
                userId: user.id,
                productId,
                rating,
                comment,
            },
        });
        return NextResponse.json({ message: "Review created successfully", review }, { status: 201 });
    } catch (error) {
        console.log({ error });
        return NextResponse.json({ error: "Failed to create review" }, { status: 500 });
    }

}
