import { verifyToken } from "@/lib/auth";
import { messaging } from "@/lib/firebase-admin";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

type Params = Promise<{ id: string }>;

export async function PATCH(req: NextRequest, { params }: { params: Params }) {
    const { id } = await params;
    const { status } = await req.json();
    const token = req.headers.get("authorization")?.split(" ")[1];
    const user = verifyToken(token || "");
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
        const transaction = await prisma.transaction.update({
            where: {
                id
            },
            data: {
                status,
            }
        });
        const user = await prisma.user.findFirst({
            where: {
                id: transaction.userId
            }
        });

        if(!user){
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        if(user.fcmToken){
            try {
                await messaging.send({
                    token: user.fcmToken,
                    notification: {
                        title: status === "SHIPPING" ?  "Yeay, pesanan mu telah dikirim" : "Yeay, pesananmu telah dikonfirmasi",
                        body: `Transaksi dengan total Rp${transaction.total.toLocaleString("id-ID")} telah dikonfirmasi`
                    },
                    data: {
                        transactionId: transaction.id
                    }
                });
            } catch (err) {
                console.error("Gagal kirim notifikasi:", err);
            }
        }
        return NextResponse.json({ message: "Success", transaction }, { status: 200 });
    } catch (error) {
        console.log({ error });
        return NextResponse.json({ error: "Failed to update review" }, { status: 500 });
    }
}
