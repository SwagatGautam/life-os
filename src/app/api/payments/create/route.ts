import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { initiateEsewaPayment } from "@/lib/payments/esewa";

const PLAN_PRICES = {
  PRO: 500,
  ENTERPRISE: 2000,
};

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { plan } = await req.json();
    if (!["PRO", "ENTERPRISE"].includes(plan)) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const amount = PLAN_PRICES[plan as keyof typeof PLAN_PRICES];
    const dbAny = db as any;
    const transaction = await dbAny.transaction.create({
      data: {
        userId: session.user.id,
        amount,
        plan,
        status: "PENDING",
      },
    });

    const esewaConfig = initiateEsewaPayment(amount, transaction.id, plan);

    return NextResponse.json({ 
      url: process.env.NEXT_PUBLIC_ESEWA_URL || "https://rc-epay.esewa.com.np/api/epay/main/v2/form",
      config: esewaConfig 
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
