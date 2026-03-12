import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";
import { generateRoomCode } from "@/lib/utils";

const meetingSchema = z.object({
  title: z.string().min(1).max(200),
  scheduledAt: z.string().optional().nullable(),
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const meetings = await db.meeting.findMany({
    where: { hostId: session.user.id },
    include: { _count: { select: { participants: true } } },
    orderBy: { createdAt: "desc" },
  }) || [];

  return NextResponse.json(meetings.map(m => ({
    ...m,
    participants: m._count?.participants || 0
  })));
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { title, scheduledAt } = meetingSchema.parse(body);

    const meeting = await db.meeting.create({
      data: {
        title,
        roomCode: generateRoomCode(),
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        hostId: session.user.id,
        isActive: false,
      },
    });

    return NextResponse.json(meeting, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
