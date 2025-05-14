import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1];
    const user = verifyToken(token || "");
    if (!user) {
        return NextResponse.json({ message : "Unauthorized" }, { status: 401 });
    }
    const body = await req.json();
    const { wa } = body;

    const existingUser = await prisma.user.findUnique({
        where: { id: user.id },
    });
    if (!existingUser) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: {
            wa
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
            avatar: true,
            bio: true,
            wa: true
        }
    });

    return NextResponse.json({ message: "Success update wa", data: updatedUser });
}