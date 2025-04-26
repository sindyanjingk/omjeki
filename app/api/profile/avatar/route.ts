import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PUT(req: NextRequest) {
    const contentType = req.headers.get('content-type') || ''

    // Cek apakah Content-Type sesuai
    if (
        !contentType.includes('multipart/form-data') &&
        !contentType.includes('application/x-www-form-urlencoded')
    ) {
        return NextResponse.json(
            { error: 'Content-Type must be multipart/form-data or application/x-www-form-urlencoded' },
            { status: 400 }
        )
    }

    const token = req.headers.get("authorization")?.split(" ")[1];
    const user = verifyToken(token || "");

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const formData = await req.formData()
        const file = formData.get('file') as File | null

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
        }

        // Upload ke Vercel Blob
        const blob = await put(file.name, file, {
            access: 'public',
        })

        if(blob.url){
            await prisma.user.update({
                where : {id : user.id},
                data : {
                    avatar : blob.url
                }
            })
        }

        return NextResponse.json({ msg : "Success update avatar", url: blob.url })
    } catch (error) {
        console.error('Upload error:', error)
        return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 })
    }
}
