import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

type Params = Promise<{ id: string }>;

export async function GET(req: NextRequest, { params }: { params: Params }) {
    const { id } = await params;
    const token = req.headers.get("authorization")?.split(" ")[1];
    const user = verifyToken(token || "");
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const reviews = await prisma.review.findMany({
            where: {
                productId: id
            }
        });
        if (reviews) {
            return NextResponse.json({ message: "Scuccess", reviews }, { status: 200 });
        } else {
            return NextResponse.json({ message: "Failed to fetch reviews", reviews: [] }, { status: 404 });
        }
    } catch (error) {
        console.log({ error });
        return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest, { params }: { params: Params }) {
    const { id } = await params;
    const token = req.headers.get("authorization")?.split(" ")[1];
    const user = verifyToken(token || "");
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { rating, comment } = await req.json();
        const review = await prisma.review.update({
            where: {
                id
            },
            data: {
                rating,
                comment
            }
        });
        if (review) {
            return NextResponse.json({ message: "Scuccess", review }, { status: 200 });
        } else {
            return NextResponse.json({ message: "Failed to update review" }, { status: 404 });
        }
    } catch (error) {
        console.log({ error });
        return NextResponse.json({ error: "Failed to update review" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Params }) {
    const { id } = await params;
    const token = req.headers.get("authorization")?.split(" ")[1];
    const user = verifyToken(token || "");
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
        const review = await prisma.review.delete({
            where: {
                id
            }
        });
        if (review) {
            return NextResponse.json({ message: "Scuccess", review }, { status: 200 });
        } else {
            return NextResponse.json({ message: "Failed to delete review" }, { status: 404 });
        }
    } catch (error) {
        console.log({ error });
        return NextResponse.json({ error: "Failed to delete review" }, { status: 500 });
    }
}