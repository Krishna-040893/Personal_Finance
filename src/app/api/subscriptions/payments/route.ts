import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAuthUserId } from "@/lib/get-user-id";
import { updateSubscriptionPaymentSchema } from "@/lib/schemas";

export async function PATCH(req: NextRequest) {
  try {
    const userId = await getAuthUserId();

    const body = await req.json();
    const parsed = updateSubscriptionPaymentSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid data", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { paymentId, status } = parsed.data;

    const payment = await db.subscriptionPayment.findFirst({
      where: { id: paymentId, userId },
    });

    if (!payment) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const updated = await db.subscriptionPayment.update({
      where: { id: paymentId },
      data: {
        status,
        paidDate: status === "PAID" ? new Date() : null,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Failed to update subscription payment:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const userId = await getAuthUserId();

    const { searchParams } = new URL(req.url);
    const month = parseInt(searchParams.get("month") ?? String(new Date().getMonth() + 1));
    const year = parseInt(searchParams.get("year") ?? String(new Date().getFullYear()));

    const payments = await db.subscriptionPayment.findMany({
      where: { userId, month, year },
      include: { subscription: { include: { creditCard: true } } },
      orderBy: { dueDate: "asc" },
    });

    return NextResponse.json(payments);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Failed to fetch subscription payments:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
