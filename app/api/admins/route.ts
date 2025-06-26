import prisma from "@/hooks/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }
    const admin = await prisma.admin.create({
      data: { name, email, password },
    });
    return NextResponse.json(admin, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to create admin: ${error}` },
      { status: 500 }
    );
  }
}
