import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const token = req.headers.get("authorization")?.split(" ")[1];
    const user = verifyToken(token || "");

    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    try {
        const userAddress = await prisma.address.findMany({
            where: {
                userId: user.id,
                deletedAt: null
            }
        })
        if (!userAddress) {
            return NextResponse.json({ msg: "User dont have address", data: [] })
        }

        return NextResponse.json({ data: userAddress, msg: "Success get all address" });
    } catch (error) {
        console.log({ error });
        return NextResponse.json({ msg: "Terjadi kesalahan" })
    }
}

export async function POST(req: NextRequest) {

    const {
        kabupaten,
        kecamatan,
        kelurahan,
        keterangan,
        zip,
        userId,
    } = await req.json();

    const user = await prisma.user.findFirst({
        where : {
            id : userId
        }
    })

    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    try {
        const data = await prisma.address.create({
            data: {
                userId: user.id,
                kabupaten,
                kecamatan,
                kelurahan,
                keterangan,
                zip,
            }
        })
        return NextResponse.json({ msg: "Success create address", data })
    } catch (error) {
        console.log({ error });
        return NextResponse.json({ msg: "Terjadi kesalahan" })
    }

}

export async function PUT(req: NextRequest) {
    const token = req.headers.get("authorization")?.split(" ")[1];
    const user = verifyToken(token || "");
    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    try {
        const {
            kabupaten,
            kecamatan,
            kelurahan,
            keterangan,
            zip,
            id,
        } = await req.json();

        const address = await prisma.address.findUnique({
            where: {
                id: id
            }
        })

        if (!address) {
            return NextResponse.json({ msg: "Address not found" }, { status: 404 })
        }
        const data = await prisma.address.update({
            where: {
                id: id
            },
            data: {
                kabupaten,
                kecamatan,
                kelurahan,
                keterangan,
                zip,
            }
        })
        return NextResponse.json({ msg: "Success update address", data })
    } catch (error) {
        console.log({ error });
        return NextResponse.json({ msg: "Terjadi kesalahan" })
    }
}

export async function DELETE(req: NextRequest) {
    const token = req.headers.get("authorization")?.split(" ")[1];
    const user = verifyToken(token || "");
    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    const { id } = await req.json();
    try {
        const address = await prisma.address.findUnique({
            where: {
                id: id
            }
        })
        if (!address) {
            return NextResponse.json({ msg: "Address not found" }, { status: 404 })
        }
        await prisma.address.update({
            where: {
                id: id
            },
            data: {
                deletedAt: new Date()
            }
        })
        return NextResponse.json({ msg: "Success delete address" })
    } catch (error) {
        console.log({ error });
        return NextResponse.json({ msg: "Terjadi kesalahan" })
    }
}