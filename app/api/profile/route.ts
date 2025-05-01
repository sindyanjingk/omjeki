import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
    const token = req.headers.get("authorization")?.split(" ")[1];
    const user = verifyToken(token || "");

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const userProfile = await prisma.user.findFirst({
            where: { id: user.id },
            select : {
                id : true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
                avatar: true,
                bio: true,
                wa: true,
                address: true,
            }
        })
        if (!userProfile) {
            return NextResponse.json({ msg: "User not found" })
        }

        return NextResponse.json({ userProfile });
    } catch (error) {
        console.log({ error });
        return NextResponse.json({ msg: "Terjadi kesalahan" })
    }
}

export async function PUT(req: NextRequest) {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1];
    const user = verifyToken(token || "");
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await req.json();
    const { name, wa } = body;

    const updatedProduct = await prisma.user.update({
        where: { id : user.id },
        data: {
            name,
            wa,
        },
        select : {
            id : true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
            avatar: true,
            bio: true,
            wa: true
        }
    });

    return NextResponse.json(updatedProduct);
}