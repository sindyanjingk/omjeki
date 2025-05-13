// app/api/auth/login/route.ts
import { adminAuth } from "@/lib/firebase-admin";
import { prisma } from "@/lib/prisma";
import { sign } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { idToken, fcmToken } = body;

    try {
        const decoded = await adminAuth.verifyIdToken(idToken);
        if (!decoded?.email) {
            return NextResponse.json({ message: "Email dan kosong" }, { status: 400 });
        }

        const user = await prisma.user.findFirst({ where: { email: decoded.email } });

        if (!user) {
            const newUser = await prisma.user.create({
                data: {
                    name: decoded.name,
                    email: decoded.email,
                    avatar: decoded.picture,
                    role: "USER",
                    wa: decoded.phone_number || "",
                    fcmToken : fcmToken  || ""
                }
            })

            const token = sign(
                {
                    id: newUser.id,
                    email: newUser.email,
                    name: newUser.name,
                    role: newUser.role
                },
                JWT_SECRET,
                { expiresIn: "7d" }
            );
            return NextResponse.json({ token, message: "Login success" }, { status: 200 });
        } else {
            await prisma.user.update({
                where : {
                    id : user.id
                },
                data : {
                    fcmToken : fcmToken
                }
            })
            const token = sign(
                {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role
                },
                JWT_SECRET,
                { expiresIn: "7d" }
            );
            return NextResponse.json({
                message: "Login berhasil",
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
            });

        }
    } catch (error) {
        console.log({ error });
        return NextResponse.json({ message: "Login failed" }, { status: 400 });

    }
}