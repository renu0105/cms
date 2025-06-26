import prisma from "@/hooks/prisma";
import { auth, verifyToken } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

interface AuthResponse {
  authorized: boolean;
  user?: Record<string, unknown>;
  error?: string;
}

export const getSessionToken = async () => {
  const { getToken } = await auth();
  const token = await getToken();
  return token || null;
};

export const verifySession = async (
  req: NextRequest
): Promise<AuthResponse> => {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || authHeader.startsWith("Bearer")) {
    return { authorized: false, error: "Authentication required" };
  }
  const token = authHeader.slice(7).trim();

  try {
    const decoded = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
    });
    return { authorized: true, user: decoded };
  } catch (error) {
    console.log(error);
    return { authorized: false, error: "invalid or expired token" };
  }
};
// Example function to check admin existence
export const checkAdmin = async (user: { id: string }) => {
  // Assuming user.id maps to your Admin table
  const admin = await prisma.admin.findUnique({
    where: { id: Number(user.id) }, // You may need to map your auth user ID to Admin ID
  });

  if (!admin) {
    return NextResponse.json({ error: "Admin not found" }, { status: 404 });
  }

  const adminId = admin.id;
  return { adminId };
};
