import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { startOfDay } from "date-fns";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const analytics = await db.analytics.findMany({
    where: { userId: session.user.id },
    orderBy: { date: "desc" },
    take: 30, // Last 30 days
  });

  return NextResponse.json(analytics);
}

// Generally analytics would be updated by individual module actions
// but we can provide a manual sync or update route here.
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const date = startOfDay(new Date());

  // Aggregate current day stats
  const [tasks, habits, workouts, books] = await Promise.all([
    db.task.count({ where: { userId: session.user.id, status: "DONE", updatedAt: { gte: date } } }),
    db.habitLog.count({ where: { userId: session.user.id, completed: true, date: date } }),
    db.workout.count({ where: { userId: session.user.id, date: { gte: date } } }),
    db.book.aggregate({
      where: { userId: session.user.id, updatedAt: { gte: date } },
      _sum: { currentPage: true } // This is simple, maybe it should be delta
    })
  ]);

  const analytic = await db.analytics.upsert({
    where: {
      userId_date: {
        userId: session.user.id,
        date: date,
      },
    },
    update: {
      tasksCompleted: tasks,
      habitsCompleted: habits,
      workoutsLogged: workouts,
      // pagesRead logic might need more refined tracking
    },
    create: {
      userId: session.user.id,
      date: date,
      tasksCompleted: tasks,
      habitsCompleted: habits,
      workoutsLogged: workouts,
    },
  });

  return NextResponse.json(analytic);
}
