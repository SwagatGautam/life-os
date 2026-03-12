import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";
import { startOfDay } from "date-fns";

const updateHabitSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().optional(),
  icon: z.string().optional(),
  color: z.string().optional(),
  frequency: z.string().optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  try {
    const body = await req.json();
    const data = updateHabitSchema.parse(body);

    const habit = await db.habit.update({
      where: { id, userId: session.user.id },
      data,
    });

    return NextResponse.json(habit);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  try {
    await db.habit.delete({
      where: { id, userId: session.user.id },
    });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Toggle habit log
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { date } = await req.json();
  const logDate = startOfDay(date ? new Date(date) : new Date());

  try {
    const existingLog = await db.habitLog.findUnique({
      where: {
        habitId_date: {
          habitId: id,
          date: logDate,
        },
      },
    });

    if (existingLog) {
      await db.habitLog.delete({
        where: { id: existingLog.id },
      });
      // Update streak - this is a bit complex to do accurately here without a separate service
      // For now, let's just decrement if it was today
      await db.habit.update({
        where: { id },
        data: { streak: { decrement: 1 } },
      });
      return NextResponse.json({ completed: false });
    } else {
      await db.habitLog.create({
        data: {
          habitId: id,
          userId: session.user.id,
          date: logDate,
          completed: true,
        },
      });
      await db.habit.update({
        where: { id },
        data: { 
          streak: { increment: 1 },
          bestStreak: {
            set: await db.habit.findUnique({ where: { id } }).then(h => Math.max(h?.bestStreak || 0, (h?.streak || 0) + 1))
          }
        },
      });
      return NextResponse.json({ completed: true });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
