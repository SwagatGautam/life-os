import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const settingsSchema = z.object({
  theme: z.enum(["light", "dark", "system"]).optional(),
  dashboardLayout: z.any().optional(),
  pomodoroWork: z.number().int().min(1).optional(),
  pomodoroBreak: z.number().int().min(1).optional(),
  pomodoroLong: z.number().int().min(1).optional(),
  weeklyGoal: z.number().int().min(1).optional(),
  currency: z.string().optional(),
  timezone: z.string().optional(),
  notifications: z.boolean().optional(),
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const settings = await db.userSettings.findUnique({
    where: { userId: session.user.id },
  });

  if (!settings) {
    // Return defaults if none exist
    return NextResponse.json({
      theme: "dark",
      pomodoroWork: 25,
      pomodoroBreak: 5,
      pomodoroLong: 15,
      currency: "USD",
    });
  }

  return NextResponse.json(settings);
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const data = settingsSchema.parse(body);

    const settings = await db.userSettings.upsert({
      where: { userId: session.user.id },
      update: data,
      create: {
        ...data,
        userId: session.user.id,
      },
    });

    return NextResponse.json(settings);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
