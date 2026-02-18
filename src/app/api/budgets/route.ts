import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

// TODO: Replace with actual auth user ID
const getUserId = async () => {
  const user = await db.user.findFirst();
  return user?.id ?? "";
};

const createBudgetSchema = z.object({
  amount: z.number().positive(),
  categoryId: z.string().min(1),
  month: z.number().int().min(1).max(12),
  year: z.number().int().min(2020).max(2100),
});

export async function POST(req: NextRequest) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = createBudgetSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid data", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    // Upsert: update if budget for this category/month/year already exists
    const budget = await db.budget.upsert({
      where: {
        categoryId_month_year_userId: {
          categoryId: parsed.data.categoryId,
          month: parsed.data.month,
          year: parsed.data.year,
          userId,
        },
      },
      update: { amount: parsed.data.amount },
      create: {
        amount: parsed.data.amount,
        categoryId: parsed.data.categoryId,
        month: parsed.data.month,
        year: parsed.data.year,
        userId,
      },
    });

    return NextResponse.json(budget, { status: 201 });
  } catch (error) {
    console.error("Failed to create budget:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const month = parseInt(searchParams.get("month") ?? "");
    const year = parseInt(searchParams.get("year") ?? "");

    const budgets = await db.budget.findMany({
      where: {
        userId,
        ...(month ? { month } : {}),
        ...(year ? { year } : {}),
      },
      include: { category: true },
    });

    return NextResponse.json(budgets);
  } catch (error) {
    console.error("Failed to fetch budgets:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
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

    const budget = await db.budget.findFirst({
      where: { id, userId },
    });

    if (!budget) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await db.budget.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete budget:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
