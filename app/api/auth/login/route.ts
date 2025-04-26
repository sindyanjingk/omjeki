// app/api/auth/login/route.ts
import { prisma } from "@/lib/prisma";
import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, password } = body;

  if (!email || !password) {
    return NextResponse.json({ error: "Email dan password wajib diisi." }, { status: 400 });
  }

  const user = await prisma.user.findFirst({ where: { email } });

  if (!user) {
    return NextResponse.json({ error: "Email tidak ditemukan." }, { status: 401 });
  }

  const passwordMatch = await compare(password, user.password);

  if (!passwordMatch) {
    return NextResponse.json({ error: "Password salah." }, { status: 401 });
  }

  const token = sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      role : user.role
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
