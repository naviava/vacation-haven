import { NextResponse } from "next/server";

import bcrypt from "bcrypt";

import prisma from "@/app/libs/prismadb";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    name: string;
    email: string;
    password: string;
  };
  const { name, email, password } = body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      hashedPassword,
    },
  });

  return NextResponse.json(user);
}
