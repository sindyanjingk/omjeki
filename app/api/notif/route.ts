import { messaging } from "@/lib/firebase-admin";
import { NextRequest, NextResponse } from "next/server";



export async function POST(req: NextRequest) {
    const {fcmToken} = await req.json();
    if(fcmToken){
        try {
            await messaging.send({
                token: fcmToken,
                notification: {
                    title: "Transaksi Berhasil",
                    body: "Total belanja kamu sebesar Rp10.000",
                },
                data: {
                    transactionId: "1234567890",
                },
            });
            return NextResponse.json({message: "Notifikasi berhasil dikirim"});
        } catch (err) {
            console.error("Gagal kirim notifikasi:", err);
            return NextResponse.json({error: "Gagal kirim notifikasi"}, {status: 500});
        }
    }
}