import { prisma } from "@/lib/prisma";
import { hash } from "bcrypt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email, password, wa } = body;

  if (!name || !email || !password) {
    return NextResponse.json({ error: "Lengkapi semua field." }, { status: 400 });
  }

  const userExists = await prisma.user.findFirst({ where: { email } });

  if (userExists) {
    return NextResponse.json({ error: "Email sudah terdaftar." }, { status: 400 });
  }

  const hashedPassword = await hash(password, 10);

  const newUser = await prisma.user.create({
    data: { name, email, password: hashedPassword, wa },
  });

  return NextResponse.json({ message: "Registrasi berhasil", user: newUser });
}
