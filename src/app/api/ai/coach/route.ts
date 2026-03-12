import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { messages } = await req.json();
    const lastMessage = messages[messages.length - 1]?.text || "";

    // Fetch user context for better "AI"
    const [tasks, habits, analytics] = await Promise.all([
      db.task.count({ where: { userId: session.user.id, status: "DONE" as any } }),
      db.habit.count({ where: { userId: session.user.id } }),
      db.analytics.findMany({
        where: { userId: session.user.id },
        orderBy: { date: 'desc' },
        take: 7
      })
    ]);

    const totalCodingHours = analytics.reduce((acc: number, curr: any) => acc + curr.codingHours, 0);

    // Simulated "Smart" Responses based on real data
    let response = "";
    if (lastMessage.toLowerCase().includes("summarize") || lastMessage.toLowerCase().includes("week")) {
      response = `**Weekly Summary Based on Real Data:**\n\n🔥 **Coding**: ${totalCodingHours}h tracked in the last 7 days.\n✅ **Tasks**: You've completed ${tasks} tasks total so far.\n🌿 **Habits**: You're currently tracking ${habits} different habits.\n\nKeep pushing! Your ${totalCodingHours > 20 ? 'stellar' : 'consistent'} coding output is impressive.`;
    } else if (lastMessage.toLowerCase().includes("focus") || lastMessage.toLowerCase().includes("tomorrow")) {
      response = `Looking at your data, here's my advice:\n\n1. **Deep Work**: Your coding hours peak on some days, try to maintain that 3-4h focus block.\n2. **Habit consistency**: You have ${habits} habits - try to hit 100% completion tomorrow.\n3. **Task management**: You've knocked out ${tasks} tasks, let's aim for 3 more critical ones tomorrow.`;
    } else {
      response = `I've analyzed your ${tasks} completed tasks and your ${totalCodingHours} coding hours. You're making solid progress. Is there anything specific from your ${habits} habits you'd like to optimize?`;
    }

    return NextResponse.json({ text: response });
  } catch (error) {
    console.error("[AI_COACH_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
