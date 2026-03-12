import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const workoutSchema = z.object({
  name: z.string().min(1),
  date: z.string().optional().transform((s) => s ? new Date(s) : new Date()),
  duration: z.number().int().nonnegative().default(0),
  notes: z.string().optional(),
  exercises: z.array(z.object({
    name: z.string().min(1),
    sets: z.any(), // Array of { weight, reps, rpe }
    notes: z.string().optional(),
  })).optional(),
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const workouts = await db.workout.findMany({
    where: { userId: session.user.id },
    include: { exercises: true },
    orderBy: { date: "desc" },
  });

  return NextResponse.json(workouts);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { exercises, ...rest } = workoutSchema.parse(body);

    const workout = await db.workout.create({
      data: {
        ...rest,
        userId: session.user.id,
        exercises: {
          create: exercises || [],
        },
      },
      include: { exercises: true },
    });

    return NextResponse.json(workout, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
