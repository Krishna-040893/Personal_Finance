import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

const getUserId = async () => {
  const user = await db.user.findFirst();
  return user?.id ?? "";
};

const updatePaymentSchema = z.object({
  paymentId: z.string().min(1),
  status: z.enum(["PAID", "MISSED", "UPCOMING"]),
});

export async function PATCH(req: NextRequest) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = updatePaymentSchema.safeParse(body);

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
    console.error("Failed to update subscription payment:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
    console.error("Failed to fetch subscription payments:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
