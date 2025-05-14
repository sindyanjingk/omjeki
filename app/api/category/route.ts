import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const token = req.headers.get("authorization")?.split(" ")[1];
    const user = verifyToken(token || "");
    const { name } = await req.json();

    try {

        if (!user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const existUser = await prisma.user.findFirst({
            where: {
                id: user.id,
            },
        });
        if (!existUser) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        const category = await prisma.category.create({
            data: {
                name,
            },
        })

        return NextResponse.json({ message: "Success create category", data: category });
    } catch (error) {
        console.log({ error });
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}