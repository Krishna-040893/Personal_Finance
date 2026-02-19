import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

const getUserId = async () => {
  const user = await db.user.findFirst();
  return user?.id ?? "";
};

const createCardSchema = z.object({
  name: z.string().min(1),
  issuer: z.string().min(1),
  cardLimit: z.number().positive(),
  billingCycleDay: z.number().int().min(1).max(28),
  paymentDueDay: z.number().int().min(1).max(28),
});

export async function POST(req: NextRequest) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = createCardSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid data", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const card = await db.creditCard.create({
      data: { ...parsed.data, userId },
    });

    return NextResponse.json(card, { status: 201 });
  } catch (error) {
    console.error("Failed to create credit card:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cards = await db.creditCard.findMany({
      where: { userId },
      include: {
        subscriptions: {
          include: {
            payments: {
              orderBy: [{ year: "desc" }, { month: "desc" }],
              take: 1,
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Calculate utilization per card
    const result = cards.map((card) => {
      const activeSubscriptionTotal = card.subscriptions
        .filter((s) => s.isActive)
        .reduce((sum, s) => sum + s.amount, 0);

      return {
        ...card,
        activeSubscriptionTotal,
        utilization: card.cardLimit > 0 ? (activeSubscriptionTotal / card.cardLimit) * 100 : 0,
      };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Failed to fetch credit cards:", error);
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

    const card = await db.creditCard.findFirst({ where: { id, userId } });
    if (!card) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await db.creditCard.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete credit card:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
