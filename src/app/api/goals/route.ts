import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const schema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().optional(),
  category: z.string().default("personal"),
  target: z.number().positive(),
  current: z.number().default(0),
  unit: z.string().default("%"),
  deadline: z.string().optional().transform((s) => s ? new Date(s) : undefined),
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const goals = await db.goal.findMany({
    where: { userId: session.user.id },
    include: { milestones: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(goals);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = schema.parse(await req.json());
  const goal = await db.goal.create({
    data: { ...data, userId: session.user.id },
  });

  return NextResponse.json(goal, { status: 201 });
}
