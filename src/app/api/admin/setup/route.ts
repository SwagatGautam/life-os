import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    
    if (password !== process.env.ADMIN_SETUP_PASSWORD) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.user.update({
      where: { email },
      data: { role: "ADMIN" } as any,
    });

    return NextResponse.json({ success: true, message: `User ${user.email} is now an ADMIN` });
  } catch (error) {
    return NextResponse.json({ error: "User not found or internal error" }, { status: 500 });
  }
}
