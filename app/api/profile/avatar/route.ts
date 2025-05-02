import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PUT(req: NextRequest) {
    const token = req.headers.get("authorization")?.split(" ")[1];
    const user = verifyToken(token || "");

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const formData = await req.formData();
        const file = formData.get("file");

        if (!file || typeof file === "string") {
            return NextResponse.json({ error: "No valid file uploaded" }, { status: 400 });
        }

        const blob = await put(file.name || "avatar.jpg", file.stream(), {
            access: "public",
        });

        await prisma.user.update({
            where: { id: user.id },
            data: {
                avatar: blob.url,
            },
        });

        return NextResponse.json({ msg: "Success update avatar", url: blob.url });
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
    }
}
