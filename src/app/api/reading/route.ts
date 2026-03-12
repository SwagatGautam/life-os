import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const bookSchema = z.object({
  title: z.string().min(1),
  author: z.string().min(1),
  coverUrl: z.string().url().optional().or(z.literal("")),
  totalPages: z.number().int().nonnegative().default(0),
  currentPage: z.number().int().nonnegative().default(0),
  status: z.enum(["WANT_TO_READ", "READING", "COMPLETED", "ABANDONED"]).default("WANT_TO_READ"),
  startDate: z.string().optional().transform((s) => s ? new Date(s) : undefined),
  finishDate: z.string().optional().transform((s) => s ? new Date(s) : undefined),
  rating: z.number().int().min(1).max(5).optional(),
  notes: z.string().optional(),
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const books = await db.book.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json(books);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const data = bookSchema.parse(body);

    const book = await db.book.create({
      data: {
        ...data,
        userId: session.user.id,
      },
    });

    return NextResponse.json(book, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
