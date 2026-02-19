import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAuthUserId } from "@/lib/get-user-id";
import { createBudgetSchema } from "@/lib/schemas";

export async function POST(req: NextRequest) {
  try {
    const userId = await getAuthUserId();

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
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Failed to create budget:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const userId = await getAuthUserId();

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
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Failed to fetch budgets:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const userId = await getAuthUserId();

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
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Failed to delete budget:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
