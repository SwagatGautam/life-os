import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyEsewaPayment } from "@/lib/payments/esewa";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const data = searchParams.get("data");

  if (!data) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/pricing?status=error`);
  }

  try {
    const verification = await verifyEsewaPayment(data);
    
    if (verification && verification.status === "COMPLETE") {
      const transactionId = verification.transaction_uuid;
      const dbAny = db as any;
      
      const transaction = await dbAny.transaction.update({
        where: { id: transactionId },
        data: {
          status: "COMPLETED",
          providerRef: verification.transaction_code,
        },
      });

      // Update User Plan
      await db.user.update({
        where: { id: transaction.userId },
        data: {
          plan: transaction.plan,
          subscriptionStatus: "active",
          subscriptionExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        } as any,
      });

      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard?subscription=success`);
    } else {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/pricing?status=failed`);
    }
  } catch (error) {
    console.error("eSewa callback error:", error);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/pricing?status=error`);
  }
}
