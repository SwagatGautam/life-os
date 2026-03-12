import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { prompt } = await req.json();

  // Gather user data for context
  const [tasks, goals, habits] = await Promise.all([
    db.task.findMany({ where: { userId: session.user.id }, take: 20, orderBy: { updatedAt: "desc" } }),
    db.goal.findMany({ where: { userId: session.user.id }, take: 10 }),
    db.habit.findMany({ where: { userId: session.user.id }, take: 10, include: { logs: { take: 7 } } }),
  ]);

  const context = `
User dashboard data:
- Tasks: ${tasks.length} total, ${tasks.filter(t => t.status === "DONE").length} done, ${tasks.filter(t => t.status === "IN_PROGRESS").length} in progress
- Goals: ${goals.map(g => `${g.title}: ${Math.round((g.current/g.target)*100)}%`).join(", ")}
- Habits: ${habits.map(h => `${h.name} (${h.streak}d streak)`).join(", ")}
  `.trim();

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "You are a personal productivity coach for a software developer. Provide concise, actionable insights based on their dashboard data. Use markdown formatting with emojis. Keep responses under 200 words.",
      },
      {
        role: "user",
        content: `Context:\n${context}\n\nUser question: ${prompt}`,
      },
    ],
    max_tokens: 400,
    temperature: 0.7,
  });

  const message = completion.choices[0]?.message?.content ?? "Unable to generate insights right now.";
  return NextResponse.json({ message });
}
