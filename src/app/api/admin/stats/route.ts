import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { format } from "date-fns";

export async function GET() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const dbAny = db as any;

    const [totalUsers, activeSubscriptions, totalRevenue, transactions] = await Promise.all([
      db.user.count(),
      db.user.count({ where: { subscriptionStatus: "active" } as any }),
      dbAny.transaction.aggregate({
        where: { status: "COMPLETED" },
        _sum: { amount: true },
      }),
      dbAny.transaction.findMany({
        where: { status: "COMPLETED" },
        orderBy: { createdAt: "asc" },
      }),
    ]);

    const usersByPlan = await db.user.groupBy({
      by: ["plan"] as any,
      _count: true,
    });

    const tierDistribution = (usersByPlan as any[]).map((item: any) => ({
      name: item.plan,
      count: item._count,
    }));

    const revenueHistory = (transactions as any[]).map((t: any) => ({
      date: format(t.createdAt, "MMM d"),
      amount: t.amount,
    }));

    const conversionRate = totalUsers > 0 ? Math.round((activeSubscriptions / totalUsers) * 100) : 0;

    return NextResponse.json({
      totalUsers,
      activeSubscriptions,
      totalRevenue: totalRevenue?._sum?.amount || 0,
      conversionRate,
      tierDistribution,
      revenueHistory,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
