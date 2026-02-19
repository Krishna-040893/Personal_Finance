import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

const getUserId = async () => {
  const user = await db.user.findFirst();
  return user?.id ?? "";
};

const createSubscriptionSchema = z.object({
  name: z.string().min(1),
  amount: z.number().positive(),
  billingDay: z.number().int().min(1).max(28),
  category: z.enum(["WORK", "PERSONAL"]),
  creditCardId: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = createSubscriptionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid data", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const subscription = await db.subscription.create({
      data: { ...parsed.data, userId },
    });

    // Create payment record for current month
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    const dueDate = new Date(year, month - 1, parsed.data.billingDay);

    await db.subscriptionPayment.create({
      data: {
        subscriptionId: subscription.id,
        month,
        year,
        dueDate,
        amount: parsed.data.amount,
        status: "UPCOMING",
        userId,
      },
    });

    return NextResponse.json(subscription, { status: 201 });
  } catch (error) {
    console.error("Failed to create subscription:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const subscriptions = await db.subscription.findMany({
      where: { userId },
      include: {
        creditCard: true,
        payments: {
          orderBy: [{ year: "desc" }, { month: "desc" }],
          take: 1,
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(subscriptions);
  } catch (error) {
    console.error("Failed to fetch subscriptions:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { id, isActive } = body;

    if (!id || typeof isActive !== "boolean") {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const subscription = await db.subscription.findFirst({ where: { id, userId } });
    if (!subscription) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const updated = await db.subscription.update({
      where: { id },
      data: { isActive },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Failed to update subscription:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    const subscription = await db.subscription.findFirst({ where: { id, userId } });
    if (!subscription) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await db.subscription.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete subscription:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
